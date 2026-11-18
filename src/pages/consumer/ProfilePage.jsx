import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Key, ShieldCheck, Mail, User as UserIcon, Copy, Check } from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, role } = useAuth();
  const [apiKey, setApiKey] = useState('af_live_9b4e72c81a3d4f55928372b0c1e48f');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Profile & Security</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your authenticated identity, API access tokens, and Row Level Security permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Role */}
        <Card glass className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt="Profile"
              className="h-24 w-24 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-xl"
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{profile?.full_name || 'Consumer User'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{profile?.email || user?.email}</p>
          </div>
          <div className="pt-2">
            <Badge variant={role === 'admin' ? 'purple' : 'primary'} size="md">
              Role: {role.toUpperCase()}
            </Badge>
          </div>
        </Card>

        {/* Right Column: API Keys & Credentials */}
        <div className="md:col-span-2 space-y-6">
          <Card glass className="p-6 space-y-4">
            <CardHeader
              title="REST API Inference Credentials"
              subtitle="Use this Bearer token to score churn inferences programmatically"
              className="p-0 border-none"
            />
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={apiKey}
                className="font-mono text-xs text-blue-400 bg-slate-950"
              />
              <Button onClick={handleCopy} variant="secondary" size="md">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">
              Header format: <code className="text-slate-400 font-mono">Authorization: Bearer {apiKey.slice(0, 12)}...</code>
            </p>
          </Card>

          <Card glass className="p-6 space-y-4">
            <CardHeader
              title="Row Level Security (RLS) Status"
              subtitle="Supabase active security context"
              className="p-0 border-none"
            />
            <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Tenant Isolation:</span>
                <span className="font-semibold text-emerald-400">Strict Consumer Scope</span>
              </div>
              <div className="flex justify-between">
                <span>Database Connection:</span>
                <span className="font-semibold text-blue-400">Supabase Auth Direct</span>
              </div>
              <div className="flex justify-between">
                <span>Authentication Provider:</span>
                <span className="font-semibold text-white">Google OAuth 2.0</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
