import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlatformRole } from '../types';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: PlatformRole[];
  fallbackPath?: string;
}

/**
 * Route guard that ensures the current user possesses one of the allowed roles.
 * If not authenticated or lacking the role, redirects to /unauthorized or fallback.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized'
}) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6 text-center font-serif">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-[#1D1D1B] border-t-transparent animate-spin mx-auto rounded-full" />
          <p className="text-xs text-[#1D1D1B]/70 font-bold">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Check if current active role satisfies required roles
  const hasAccess = allowedRoles.includes(role);

  if (!hasAccess) {
    return (
      <Navigate 
        to={fallbackPath} 
        replace 
        state={{ 
          attemptedPath: location.pathname,
          requiredRoles: allowedRoles,
          currentRole: role,
          userEmail: user?.email
        }} 
      />
    );
  }

  return <>{children}</>;
};

interface RequireAuthProps {
  children: ReactNode;
  fallbackPath?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  fallbackPath = '/unauthorized'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6 text-center font-serif">
        <div className="w-8 h-8 border-2 border-[#1D1D1B] border-t-transparent animate-spin mx-auto rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        replace 
        state={{ attemptedPath: location.pathname, reason: 'authentication_required' }} 
      />
    );
  }

  return <>{children}</>;
};
