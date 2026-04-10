import React from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Minimal loading — should resolve almost instantly from cached session
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fb]">
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => (
  <AuthProvider>
    <AuthGuard>{children}</AuthGuard>
  </AuthProvider>
);

export default ProtectedRoute;
