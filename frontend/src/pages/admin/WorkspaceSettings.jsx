import { useEffect, useState } from "react";
import { Building2, Copy, KeyRound, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { useOrg } from "@/context/OrgContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WorkspaceSettings = () => {
  const { activeOrg, refreshOrganizations } = useOrg();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!activeOrg) {
      return;
    }

    setName(activeOrg.name || "");
    setDescription(activeOrg.description || "");
    setInviteCode(activeOrg.inviteCode || "");
    setLoading(false);
  }, [activeOrg]);

  const handleSave = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(`/orgs/${activeOrg._id}`, {
        name: name.trim(),
        description: description.trim(),
      });

      const organization = response.data.organization;

      setName(organization.name || "");
      setDescription(organization.description || "");
      setInviteCode(organization.inviteCode || inviteCode);

      await refreshOrganizations();

      toast.success("Workspace settings updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update workspace",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateCode = async () => {
    try {
      setRegenerating(true);

      const response = await api.post(`/orgs/${activeOrg._id}/regenerate-code`);

      const newInviteCode =
        response.data.organization?.inviteCode || response.data.inviteCode;

      if (newInviteCode) {
        setInviteCode(newInviteCode);
      }

      await refreshOrganizations();

      toast.success("Invite code regenerated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to regenerate invite code",
      );
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteCode);

      toast.success("Invite code copied");
    } catch {
      toast.error("Failed to copy invite code");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!activeOrg) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Workspace Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace information and member access.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Workspace Information</CardTitle>

                <CardDescription>
                  Update your company's basic information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>

                <Input
                  id="workspace-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter workspace name"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-slug">Workspace Slug</Label>

                <Input
                  id="workspace-slug"
                  value={activeOrg.slug || ""}
                  disabled
                />

                <p className="text-xs text-muted-foreground">
                  The workspace slug cannot be changed here.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>

                <Textarea
                  id="workspace-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe your workspace"
                  rows={5}
                  disabled={saving}
                />
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>

              <div>
                <CardTitle>Invite Code</CardTitle>

                <CardDescription>
                  Share this code with people you want to invite.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl border bg-muted/30 p-5 text-center">
              <p className="text-xs text-muted-foreground">
                Current invite code
              </p>

              <p className="mt-3 break-all font-mono text-2xl font-bold tracking-[0.2em]">
                {inviteCode || "--------"}
              </p>
            </div>

            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCode}
                disabled={!inviteCode}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleRegenerateCode}
                disabled={regenerating}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    regenerating ? "animate-spin" : ""
                  }`}
                />

                {regenerating ? "Generating..." : "Regenerate Code"}
              </Button>
            </div>

            <Separator />

            <p className="text-xs leading-5 text-muted-foreground">
              Regenerating the invite code will invalidate the previous code.
              Anyone using the old code will no longer be able to join this
              workspace.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
