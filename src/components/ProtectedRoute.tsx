import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { configured, loading, session } = useAuth();
  const location = useLocation();

  // No backend configured → open demo mode, nothing sensitive to protect.
  if (!configured) return <>{children}</>;

  if (loading) {
    return <div className="auth-loading">Loading…</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
