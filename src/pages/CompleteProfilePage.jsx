import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_ROLES, ROLE_CONFIG, ROLES, getRoleRedirect } from '../config/roles';
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CheckCircle2, Building, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

export const CompleteProfilePage = () => {
  const { user, profile, completeProfile } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(profile?.role || ROLES.CONSUMER);
  const [businessName, setBusinessName] = useState(profile?.business_name || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedRole === ROLES.VENDOR && !businessName.trim()) {
      setError('Please provide your company or business name.');
      return;
    }
    if (selectedRole === ROLES.STAFF && !department.trim()) {
      setError('Please provide your engineering department.');
      return;
    }

    setLoading(true);
    try {
      await completeProfile({
        role: selectedRole,
        businessName,
        department
      });
      navigate(getRoleRedirect(selectedRole), { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      activeRole={selectedRole}
      title="Complete Your Profile"
      subtitle="Welcome! Select your workspace role to finalize setup."
      backTo="/login"
    >
      <Card glass className="p-6 sm:p-8 space-y-6 border-slate-800 shadow-2xl">
        <div className="rounded-xl bg-blue-950/60 p-3.5 border border-blue-800/80 text-xs text-blue-300 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0" />
          <span>Authenticated via Google as {user?.email}</span>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-950/60 border border-rose-800/80 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Choose Your Role</label>
            <div className="space-y-2.5">
              {PUBLIC_ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{r.title}</div>
                        <div className="text-[10px] text-slate-400">{r.description}</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedRole === ROLES.VENDOR && (
            <Input
              label="Business / Organization Name"
              icon={Building}
              placeholder="e.g. Acme Data Corp"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          )}

          {selectedRole === ROLES.STAFF && (
            <Input
              label="Engineering Department / Team"
              icon={Briefcase}
              placeholder="e.g. MLOps Core Platform"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full shadow-lg shadow-blue-600/25"
          >
            <span>Enter {ROLE_CONFIG[selectedRole]?.label} Portal</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </Card>
    </AuthSplitLayout>
  );
};

export default CompleteProfilePage;
