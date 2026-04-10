import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** Inner component that reads auth state from context */
const AuthGuard: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-skyblue mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Wraps admin routes with AuthProvider + auth check.
 * All child components can use `useAuth()` to get user/profile/permissions.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
};

export default ProtectedRoute;
