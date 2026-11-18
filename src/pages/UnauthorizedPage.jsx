import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getRoleRedirect } from '../config/roles';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { role, user } = useAuth();

  const handleReturnHome = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(getRoleRedirect(role));
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="h-16 w-16 rounded-2xl bg-rose-600/20 flex items-center justify-center text-rose-400 mb-6 border border-rose-500/30">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-800">
        403 – Access Forbidden
      </span>
      <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight">Restricted Role Area</h1>
      <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-md leading-relaxed">
        Your authenticated account (<span className="text-slate-200 font-semibold">{user?.email || 'Guest'}</span>) has the <span className="text-blue-400 font-semibold uppercase font-mono">{role || 'consumer'}</span> role, which does not have permission to access this internal portal.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => navigate(-1)} variant="secondary" size="md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Go Back</span>
        </Button>
        <Button onClick={handleReturnHome} variant="primary" size="md">
          <Home className="h-4 w-4 mr-2" />
          <span>Return to Your Portal</span>
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
