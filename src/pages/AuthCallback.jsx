import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getRoleRedirect, ROLES } from '../config/roles';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session?.user) {
        console.error('OAuth callback error:', error);
        navigate('/login', { replace: true });
        return;
      }

      const user = session.user;
      const intendedRole = localStorage.getItem('adaptflow_oauth_intended_role');
      localStorage.removeItem('adaptflow_oauth_intended_role');

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile?.role) {
          navigate(getRoleRedirect(profile.role), { replace: true });
        } else if (intendedRole && [ROLES.CONSUMER, ROLES.VENDOR, ROLES.STAFF].includes(intendedRole)) {
          // Provision with intended role
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            role: intendedRole,
            avatar_url: user.user_metadata?.avatar_url || '',
            is_active: true
          });
          navigate(getRoleRedirect(intendedRole), { replace: true });
        } else {
          // Redirect to complete profile to choose role
          navigate('/complete-profile', { replace: true });
        }
      } catch (err) {
        console.warn('Profile callback fetch error, completing profile:', err);
        navigate('/complete-profile', { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 text-white font-sans">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      <p className="mt-4 text-sm font-medium text-slate-300">Authenticating session & verifying roles...</p>
    </div>
  );
};

export default AuthCallback;
