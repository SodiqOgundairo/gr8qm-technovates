import React from "react";
import { useAuth } from "../../lib/auth";
import type { AdminModule, PermissionAction } from "../../types/permissions";
import { ShieldOff } from "lucide-react";

interface PermissionGateProps {
  module: AdminModule;
  action: PermissionAction;
  children: React.ReactNode;
  /** What to render when denied. Defaults to nothing. */
  fallback?: React.ReactNode;
  /** If true, shows an access-denied message instead of hiding */
  showDenied?: boolean;
}

/**
 * Conditionally renders children based on admin permissions.
 * Use this to wrap UI elements that should be role-gated.
 *
 * @example
 * <PermissionGate module="invoices" action="create">
 *   <button>Create Invoice</button>
 * </PermissionGate>
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  module,
  action,
  children,
  fallback,
  showDenied = false,
}) => {
  const { can, loading } = useAuth();

  if (loading) return null;

  if (!can(module, action)) {
    if (fallback) return <>{fallback}</>;
    if (showDenied) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ShieldOff size={48} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">You don't have access to this section.</p>
          <p className="text-xs mt-1">Contact a super admin if you need access.</p>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
};

export default PermissionGate;
