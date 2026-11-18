import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ROLES, DEFAULT_ROLE, getRoleRedirect } from '../config/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync profile strictly from Supabase public.profiles table
  const syncProfile = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      setRole(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data && data.role) {
        setProfile(data);
        setRole(data.role);
      } else {
        // Fallback default from metadata if profile row has not yet synchronized
        const metadataRole = authUser.user_metadata?.role;
        const assignedRole = [ROLES.CONSUMER, ROLES.VENDOR, ROLES.STAFF, ROLES.ADMIN].includes(metadataRole)
          ? metadataRole
          : DEFAULT_ROLE;

        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
          role: assignedRole,
          business_name: authUser.user_metadata?.business_name || null,
          department: authUser.user_metadata?.department || null,
          phone: authUser.user_metadata?.phone || null,
          is_active: true
        };

        await supabase.from('profiles').upsert(newProfile).catch(() => {});
        setProfile(newProfile);
        setRole(assignedRole);
      }
    } catch (err) {
      console.warn('Profile sync fallback:', err.message);
      const fallbackRole = authUser.user_metadata?.role || DEFAULT_ROLE;
      setProfile({
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        role: fallbackRole,
        is_active: true
      });
      setRole(fallbackRole);
    }
  };

  useEffect(() => {
    // Initialize Supabase auth listener
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      if (activeSession?.user) {
        setSession(activeSession);
        setUser(activeSession.user);
        syncProfile(activeSession.user).finally(() => setLoading(false));
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        await syncProfile(newSession.user);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Standard Email + Password Sign In
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data?.user) {
      await syncProfile(data.user);
    }
    return data;
  };

  // Public Role Registration (consumer, vendor, staff)
  const signUp = async ({ email, password, fullName, phone, role: chosenRole, businessName, department }) => {
    // Security check: Force public registrations to never self-assign admin
    const safeRole = chosenRole === ROLES.ADMIN ? ROLES.CONSUMER : (chosenRole || ROLES.CONSUMER);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
          role: safeRole,
          business_name: businessName || null,
          department: department || null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  };

  // Google OAuth Sign In / Sign Up
  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    if (error) throw error;
    return data;
  };

  // Admin Registration with Secret Invite Code (Server-side validated)
  const registerAdminWithCode = async ({ email, password, fullName, inviteCode }) => {
    // 1. Validate secret invite code server-side via Express API
    const verifyRes = await fetch('/api/auth/validate-admin-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode, email })
    });

    if (!verifyRes.ok) {
      const errJson = await verifyRes.json().catch(() => ({}));
      throw new Error(errJson.error || 'Server validation failed: Invalid admin invite code.');
    }

    // 2. Register user through Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: ROLES.ADMIN,
          admin_verified: true
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    // 3. Promote profile in database
    if (data?.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: ROLES.ADMIN,
        is_active: true
      }).catch(() => {});
    }

    return data;
  };

  // Complete Profile after Google OAuth
  const completeProfile = async ({ role: selectedRole, businessName, department }) => {
    if (!user) throw new Error('No authenticated user session');
    const safeRole = selectedRole === ROLES.ADMIN ? ROLES.CONSUMER : selectedRole;

    const updates = {
      role: safeRole,
      business_name: businessName || null,
      department: department || null,
      updated_at: new Date().toISOString()
    };

    await supabase.from('profiles').update(updates).eq('id', user.id);
    setRole(safeRole);
    if (profile) setProfile({ ...profile, ...updates });
  };

  // Forgot password
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  };

  // Update password (on /reset-password)
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  };

  // Sign out: Clear all session, profile, and cached state, and navigate to /login
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setRole(null);
    // Clear localStorage to prevent any cached state
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    // Replace URL to prevent back button from viewing protected pages
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        isAdmin: role === ROLES.ADMIN,
        isVendor: role === ROLES.VENDOR,
        isStaff: role === ROLES.STAFF,
        isConsumer: role === ROLES.CONSUMER,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        registerAdminWithCode,
        completeProfile,
        resetPassword,
        updatePassword,
        signOut,
        getRoleRedirect: () => (role ? getRoleRedirect(role) : '/dashboard')
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
