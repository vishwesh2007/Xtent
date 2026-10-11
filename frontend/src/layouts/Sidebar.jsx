import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import { useOrg } from "@/context/OrgContext";
import { useAuth } from "@/context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { activeOrg, activeRole, activeMemberships, switchOrg } = useOrg();

  const { logout } = useAuth();

  const role = activeRole;

  const adminItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Members",
      icon: Users,
      path: "/admin/members",
    },
    {
      label: "Join Requests",
      icon: UserRound,
      path: "/admin/join-requests",
    },
    {
      label: "Projects",
      icon: BriefcaseBusiness,
      path: "/admin/projects",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
    },
    {
      label: "AI Insights",
      icon: Sparkles,
      path: "/admin/ai-insights",
    },
    {
      label: "Workspace Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const managerItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/manager",
    },
    {
      label: "My Projects",
      icon: BriefcaseBusiness,
      path: "/manager/projects",
    },
    {
      label: "Team",
      icon: Users,
      path: "/manager/team",
    },
    {
      label: "AI Insights",
      icon: Sparkles,
      path: "/manager/ai-insights",
    },
  ];

  const employeeItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/employee",
    },
    {
      label: "My Tasks",
      icon: CheckSquare,
      path: "/employee/tasks",
    },
    {
      label: "Notifications",
      icon: ClipboardList,
      path: "/employee/notifications",
    },
    {
      label: "Performance",
      icon: BarChart3,
      path: "/employee/performance",
    },
  ];

  const items =
    role === "admin"
      ? adminItems
      : role === "manager"
        ? managerItems
        : employeeItems;

  const isActive = (path) => {
    if (path === "/admin" || path === "/manager" || path === "/employee") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleWorkspaceChange = (event) => {
    const organizationId = event.target.value;

    if (!organizationId) {
      return;
    }

    switchOrg(organizationId);

    const target =
      role === "admin"
        ? "/admin"
        : role === "manager"
          ? "/manager"
          : "/employee";

    navigate(target);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              E
            </div>

            <span className="text-lg font-semibold tracking-tight">Edge</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Workspace
          </div>

          <div className="relative">
            <select
              value={activeOrg?._id || ""}
              onChange={handleWorkspaceChange}
              className="w-full appearance-none rounded-lg border bg-background px-3 py-2.5 pr-9 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {activeMemberships.map((membership) => (
                <option
                  key={membership.organization?._id}
                  value={membership.organization?._id}
                >
                  {membership.organization?.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button
            type="button"
            onClick={() => handleNavigation("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <UserRound className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
