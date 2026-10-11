import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";
import { useOrg } from "@/context/OrgContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const { refreshOrganizations } = useOrg();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Workspace slug is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/orgs", {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
      });

      await refreshOrganizations();

      toast.success("Workspace created successfully");

      navigate("/redirect", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create workspace",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your workspace
          </h1>

          <p className="text-sm text-muted-foreground">
            Set up your company workspace and start using Edge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace name</Label>

            <Input
              id="name"
              name="name"
              placeholder="Edge Technologies"
              value={form.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Workspace slug</Label>

            <Input
              id="slug"
              name="slug"
              placeholder="edge-technologies"
              value={form.slug}
              onChange={handleChange}
            />

            <p className="text-xs text-muted-foreground">
              Use lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              placeholder="A short description about your company..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating workspace..." : "Create workspace"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/join-workspace")}
            className="text-sm font-medium text-primary hover:underline"
          >
            Join an existing workspace instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
