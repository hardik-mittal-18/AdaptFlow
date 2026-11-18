import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoleRedirect } from '../config/roles';
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { user, role, resetPassword, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && role) {
      navigate(getRoleRedirect(role), { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid account email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to process reset request. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Reset Password"
      subtitle="Enter your email to receive recovery instructions"
      backTo="/login"
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
        {error && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3.5 flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive an email with instructions to create a new password.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/login')} variant="primary" size="md">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span>Return to Login</span>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Forgot your credentials? Enter your verified account email below, and we'll send you a secure link to reset your password.
            </p>

            <Input
              label="Account Email Address"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-blue-600/25"
            >
              <span>Send Recovery Email</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </Card>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordPage;
