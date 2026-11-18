import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleRedirect } from '../config/roles';
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { user, role, updatePassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if already authenticated with active session and NOT recovering
    // But if they clicked password reset link, they have an access token in the hash
    if (!authLoading && user && role && !window.location.hash.includes('access_token')) {
      navigate(getRoleRedirect(role), { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Unable to update password. Your reset session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Create New Password"
      subtitle="Ensure your new credentials meet security requirements"
      backTo="/login"
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
        {error && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3.5 flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Password Updated Successfully</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your password has been changed. You can now use your new credentials to sign in.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/login')} variant="primary" size="md">
                <span>Sign in with New Password</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              <PasswordStrengthMeter password={password} />
            </div>

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-blue-600/25"
            >
              <span>Update Password</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        )}
      </Card>
    </AuthSplitLayout>
  );
};

export default ResetPasswordPage;
