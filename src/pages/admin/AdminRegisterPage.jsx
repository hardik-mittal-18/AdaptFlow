import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';
import { AuthSplitLayout } from '../../components/layout/AuthSplitLayout';
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  ShieldAlert,
  Key,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminRegisterPage = () => {
  const { registerAdminWithCode } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full administrative name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid administrative email.');
      return;
    }
    if (!inviteCode.trim()) {
      setError('A valid secret admin invite code is required.');
      return;
    }
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
      await registerAdminWithCode({
        email,
        password,
        fullName,
        inviteCode
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Authorization rejected: Invalid admin passphrase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      activeRole={ROLES.ADMIN}
      title="Restricted Admin Provisioning"
      subtitle="Authorized personnel only. Requires cryptographic invite secret."
      backTo="/login"
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-indigo-900/60 shadow-2xl relative">
        <div className="flex items-center gap-2 rounded-xl bg-indigo-950/80 px-3.5 py-2 border border-indigo-800/80 text-xs text-indigo-300">
          <ShieldAlert className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <span>This portal provisions root Super Admin privileges across model gates & RLS.</span>
        </div>

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
            <h3 className="text-lg font-bold text-white">Admin Account Registered</h3>
            <p className="text-xs text-slate-300">
              Your administrative credentials have been authorized. You can now sign in to access the Enterprise Command Center.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/login')} variant="primary" size="md">
                <span>Sign in to Admin Console</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Secret Invite Code Field */}
            <div className="rounded-xl bg-slate-950 p-3.5 border border-indigo-800/40 space-y-2">
              <Input
                label="Admin Secret Passphrase (Validated Server-side)"
                type="password"
                icon={Key}
                placeholder="Enter secret admin key..."
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
                className="font-mono text-indigo-300"
              />
              <p className="text-[10px] text-slate-500">
                Default local pass: <code className="text-indigo-400 font-mono">ADAPTFLOW_SECRET_ADMIN_2026</code>
              </p>
            </div>

            <Input
              label="Full Administrative Name"
              icon={User}
              placeholder="Dr. Sarah Chen"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Administrative Email"
              type="email"
              icon={Mail}
              placeholder="sarah.chen@adaptflow.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              label="Confirm Password"
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
            >
              <ShieldAlert className="h-4 w-4 mr-2" />
              <span>Verify Secret & Provision Admin</span>
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
            ← Return to standard sign in
          </Link>
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default AdminRegisterPage;
