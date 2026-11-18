import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleRedirect } from '../config/roles';
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const LoginPage = () => {
  const { user, role, signIn, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, immediately auto-redirect to user's assigned dashboard
  useEffect(() => {
    if (!authLoading && user && role) {
      navigate(getRoleRedirect(role), { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI State
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await signIn(email, password);
      // Determine user role directly from Supabase user session / profile
      const userRole = data?.user?.user_metadata?.role || 'consumer';
      navigate(getRoleRedirect(userRole), { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid login credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not enabled') || msg.toLowerCase().includes('unsupported provider')) {
        setError(
          'Google Provider is not enabled in your Supabase cloud project yet. Please enable Google in Supabase Dashboard > Authentication > Providers.'
        );
      } else {
        setError(msg || 'Unable to connect to Google OAuth.');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Sign in to your authenticated AdaptFlow portal"
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
        {/* Error Notification */}
        {error && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3.5 flex items-start gap-3 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm py-2.5 px-4 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider relative">
            Or Sign in with Email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="space-y-1">
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[34px] text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full shadow-lg shadow-blue-600/25"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Create an account
          </Link>
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default LoginPage;
