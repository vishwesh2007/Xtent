import {
  Bell,
  Menu,
  Search,
  UserCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

import api from "@/lib/api";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { activeOrg, activeRole } = useOrg();

  const [unreadCount, setUnreadCount] = useState(0);

  const roleLabel =
    activeRole === "admin"
      ? "Admin"
      : activeRole === "manager"
        ? "Manager"
        : "Employee";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const loadUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notifications/unread-count"
      );

      setUnreadCount(response.data.count || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!activeOrg) {
      setUnreadCount(0);
      return;
    }

    loadUnreadCount();

    const interval = setInterval(
      loadUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, [activeOrg]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {activeOrg?.name || "Workspace"}
          </p>

          <p className="text-xs text-muted-foreground">
            {roleLabel}
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="ml-3 flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-muted"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
          {initials}
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-32 truncate text-sm font-medium">
            {user?.name || "User"}
          </p>

          <p className="max-w-32 truncate text-xs text-muted-foreground">
            {user?.email || ""}
          </p>
        </div>

        <UserCircle className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </button>
    </header>
  );
};

export default Topbar;