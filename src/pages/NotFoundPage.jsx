import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Layers, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="h-16 w-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
        <Layers className="h-8 w-8" />
      </div>
      <h1 className="text-6xl font-extrabold text-white tracking-tight">404</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-200">Page Not Found</h2>
      <p className="mt-2 text-xs text-slate-400 max-w-sm">
        The requested MLOps route or telemetry view does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate('/')} variant="primary" size="md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Return Home</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
