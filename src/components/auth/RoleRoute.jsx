import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { getRoleRedirect } from '../../config/roles';

export const RoleRoute = ({ children, allow = [], allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  const permittedRoles = allow.length > 0 ? allow : allowedRoles;

  // Keep loading spinner active until session & profile are fully determined
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-xs font-medium text-slate-400">Verifying session & database permissions...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not permitted for this route, block access and redirect to 403 /unauthorized
  if (permittedRoles.length > 0 && (!role || !permittedRoles.includes(role))) {
    return <Navigate to="/unauthorized" state={{ from: location, attemptedRole: permittedRoles }} replace />;
  }

  return children;
};

export default RoleRoute;
