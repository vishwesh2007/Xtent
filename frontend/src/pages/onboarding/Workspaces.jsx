import { useState } from "react";
import { Building2, Check, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { useOrg } from "@/context/OrgContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Workspaces = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { activeMemberships, activeOrg, switchOrg } = useOrg();

  const [selectedId, setSelectedId] = useState(activeOrg?._id || null);

  const handleSelect = (membership) => {
    const organizationId = membership.organization?._id;

    if (!organizationId) {
      return;
    }

    setSelectedId(organizationId);
    switchOrg(organizationId);

    toast.success(`Switched to ${membership.organization.name}`);

    navigate("/redirect", { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Choose a workspace
          </h1>

          <p className="text-sm text-muted-foreground">
            Select the company workspace you want to continue with.
          </p>
        </div>

        <div className="grid gap-4">
          {activeMemberships.map((membership) => {
            const organization = membership.organization;
            const isSelected = selectedId === organization?._id;

            return (
              <Card
                key={membership._id}
                className={`cursor-pointer transition ${
                  isSelected
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSelect(membership)}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </div>

                    <div>
                      <h2 className="font-medium">{organization?.name}</h2>

                      <p className="text-sm text-muted-foreground">
                        {organization?.description || "Edge workspace"}
                      </p>

                      <p className="mt-1 text-xs capitalize text-muted-foreground">
                        {membership.role}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-4" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Workspaces;
