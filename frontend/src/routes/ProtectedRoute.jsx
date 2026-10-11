import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

const ProtectedRoute = ({
  allowedRoles = [],
  requireWorkspace = true,
  children,
}) => {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const {
    activeOrg,
    activeRole,
    activeMemberships,
    pendingMemberships,
    loading: orgLoading,
  } = useOrg();

  const location = useLocation();

  if (authLoading || (isAuthenticated && orgLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!requireWorkspace) {
    return children || <Outlet />;
  }

  if (activeMemberships.length === 0) {
    if (pendingMemberships.length > 0) {
      return <Navigate to="/pending" replace />;
    }

    return <Navigate to="/onboarding" replace />;
  }

  if (activeMemberships.length === 1 && !activeOrg) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  if (activeMemberships.length > 1 && !activeOrg) {
    return <Navigate to="/workspaces" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    const roleRoutes = {
      admin: "/admin",
      manager: "/manager",
      employee: "/employee",
    };

    return <Navigate to={roleRoutes[activeRole] || "/onboarding"} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
