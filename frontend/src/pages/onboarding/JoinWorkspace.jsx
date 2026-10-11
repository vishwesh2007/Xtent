import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";
import { useOrg } from "@/context/OrgContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const JoinWorkspace = () => {
  const navigate = useNavigate();
  const { refreshOrganizations } = useOrg();

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = inviteCode.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter an invite code");
      return;
    }

    try {
      setLoading(true);

      await api.post("/orgs/join-with-code", {
        inviteCode: code,
      });

      await refreshOrganizations();

      toast.success("Join request sent successfully");

      navigate("/pending", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Join a workspace
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter the invite code provided by your company admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite code</Label>

            <Input
              id="inviteCode"
              name="inviteCode"
              placeholder="VGYIAT9I"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              maxLength={8}
              autoComplete="off"
              className="text-center text-lg font-medium tracking-[0.2em]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join workspace"}
          </Button>
        </form>

        <div className="space-y-3 text-center">
          <button
            type="button"
            onClick={() => navigate("/create-workspace")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Create a new workspace
          </button>

          <div>
            <button
              type="button"
              onClick={() => navigate("/onboarding")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinWorkspace;
