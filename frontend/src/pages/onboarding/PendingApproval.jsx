import { Clock3, LogOut, RefreshCw } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PendingApproval = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const {
    pendingMemberships,
    activeMemberships,
    refreshOrganizations,
    loading: orgLoading,
  } = useOrg();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orgLoading) {
      return;
    }

    if (activeMemberships.length > 0) {
      navigate("/redirect", {
        replace: true,
      });
    }
  }, [activeMemberships, orgLoading, navigate]);

  const handleRefresh = async () => {
    try {
      setLoading(true);

      await refreshOrganizations();

      toast.success("Workspace status refreshed");
    } catch {
      toast.error("Failed to refresh workspace status");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  if (orgLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-4 text-sm text-muted-foreground">
            Checking workspace status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock3 className="size-6" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Approval pending
          </h1>

          <p className="text-sm text-muted-foreground">
            Your workspace join request is waiting for admin approval.
          </p>
        </div>

        {pendingMemberships.length > 0 ? (
          <div className="space-y-4">
            {pendingMemberships.map((membership) => (
              <Card key={membership._id}>
                <CardContent className="space-y-3 p-5">
                  <div>
                    <p className="font-medium">
                      {membership.organization?.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Requested as Employee
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                    An administrator needs to approve your request before you
                    can access this workspace.
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No pending workspace requests found.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />

            {loading ? "Refreshing..." : "Check status"}
          </Button>

          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
