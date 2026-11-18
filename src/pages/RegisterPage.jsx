import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROLES, ROLE_CONFIG, ROLES, getRoleRedirect } from '../config/roles';
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const RegisterPage = () => {
  const { user, role, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to user's assigned dashboard
  useEffect(() => {
    if (!authLoading && user && role) {
      navigate(getRoleRedirect(role), { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  // Step 1: Role Selection | Step 2: Form | Step 3: Success Verification Notice
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(ROLES.CONSUMER);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [department, setDepartment] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNextStep = () => {
    setError(null);
    setCurrentStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid corporate or personal email.');
      return;
    }
    if (selectedRole === ROLES.VENDOR && !businessName.trim()) {
      setError('Please provide your business or organization name.');
      return;
    }
    if (selectedRole === ROLES.STAFF && !department.trim()) {
      setError('Please provide your engineering department.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the AdaptFlow Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email,
        password,
        fullName,
        phone,
        role: selectedRole,
        businessName,
        department
      });
      setCurrentStep(3); // Show verification screen
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle(selectedRole);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not enabled') || msg.toLowerCase().includes('unsupported provider')) {
        setError(
          'Google Provider is not enabled in your Supabase cloud project yet. Please go to Supabase Dashboard > Authentication > Providers > Google, toggle it ON, and paste your Google Client ID and Secret.'
        );
      } else {
        setError(msg || 'Unable to connect to Google OAuth.');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      activeRole={selectedRole}
      title="Create Your Account"
      subtitle={
        currentStep === 1
          ? 'Step 1 of 2: Select your role in the MLOps ecosystem'
          : currentStep === 2
          ? `Step 2 of 2: Register as ${ROLE_CONFIG[selectedRole]?.label}`
          : 'Registration Submitted'
      }
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
        {/* Step Indicator Header */}
        {currentStep < 3 && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span className={currentStep === 1 ? 'font-bold text-white' : 'text-slate-400'}>
                Role Selection
              </span>
            </div>
            <div className="h-0.5 w-8 bg-slate-800" />
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                2
              </span>
              <span className={currentStep === 2 ? 'font-bold text-white' : 'text-slate-400'}>
                Profile & Security
              </span>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3.5 flex items-start gap-3 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION CARDS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select the workspace profile that best aligns with your daily tasks:
            </p>

            <div className="space-y-3">
              {PUBLIC_ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <motion.div
                    key={r.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedRole(r.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-start gap-4 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500/20 shadow-lg'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{r.title}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                      </div>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Button
              onClick={handleNextStep}
              variant="primary"
              size="lg"
              className="w-full mt-4 shadow-lg shadow-blue-600/25"
            >
              <span>Continue as {ROLE_CONFIG[selectedRole]?.label}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              <span>Have an admin authorization code? </span>
              <Link to="/admin/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Admin Registration
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE FORM WITH EXTRA ROLE FIELDS */}
        {currentStep === 2 && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Google Quick Sign-up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              <span>{googleLoading ? 'Connecting...' : `Sign up with Google as ${ROLE_CONFIG[selectedRole]?.label}`}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider relative">
                Or Complete Information
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                icon={User}
                placeholder="Dr. Jordan Lee"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Phone (Optional)"
                type="tel"
                icon={Phone}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              placeholder="jordan.lee@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Extra Fields Per Role */}
            {selectedRole === ROLES.VENDOR && (
              <Input
                label="Company / Vendor Organization"
                icon={Building}
                placeholder="Apex Data Solutions Inc."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            )}

            {selectedRole === ROLES.STAFF && (
              <Input
                label="Engineering Department"
                icon={Briefcase}
                placeholder="Production MLOps & SRE"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            )}

            {/* Password with Strength Meter */}
            <div className="space-y-1">
              <div className="relative">
                <Input
                  label="Create Password"
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

            <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I agree to the <span className="text-blue-400 underline">Terms of Service</span> and acknowledge the <span className="text-blue-400 underline">Data Privacy Policy</span>.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setCurrentStep(1)}
                variant="secondary"
                size="lg"
                className="w-1/3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-2/3 shadow-lg shadow-blue-600/25"
              >
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: REGISTRATION SUBMITTED & VERIFICATION MESSAGE */}
        {currentStep === 3 && (
          <div className="text-center space-y-5 py-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Verify Your Email Address</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                We have dispatched a secure confirmation link to <span className="font-semibold text-white">{email}</span>. Click the link in your inbox to verify your identity and activate your {ROLE_CONFIG[selectedRole]?.label} account.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-400 space-y-1 text-left">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>What happens next?</span>
              </div>
              <p>• Clicking the link will authenticate you and securely activate your {ROLE_CONFIG[selectedRole]?.label} portal.</p>
              <p>• You can also proceed directly to the Sign In screen once confirmed.</p>
            </div>

            <div className="pt-2">
              <Button onClick={() => navigate('/login')} variant="primary" size="md">
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Bottom Link */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Already registered? </span>
          <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign in here
          </Link>
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default RegisterPage;
