import { Navigate } from "react-router-dom";
import { useOrg } from "@/context/OrgContext";

const RoleRedirect = () => {
  const { activeOrg, activeRole, activeMemberships } = useOrg();

  if (!activeOrg) {
    if (activeMemberships.length > 1) {
      return <Navigate to="/workspaces" replace />;
    }

    return <Navigate to="/onboarding" replace />;
  }

  const roleRoutes = {
    admin: "/admin",
    manager: "/manager",
    employee: "/employee",
  };

  return <Navigate to={roleRoutes[activeRole] || "/onboarding"} replace />;
};

export default RoleRedirect;
