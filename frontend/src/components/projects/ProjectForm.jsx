import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialForm = {
  name: "",
  client: "",
  description: "",
  manager: "",
  team: [],
  startDate: "",
  deadline: "",
  budget: "",
  revenue: "",
  expense: "",
  status: "new",
};

const ProjectForm = ({ project = null, onSuccess, onCancel }) => {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(project);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoadingMembers(true);

        const response = await api.get("/members");

        setMembers(response.data.members || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load workspace members",
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  useEffect(() => {
    if (!project) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: project.name || "",
      client: project.client || "",
      description: project.description || "",
      manager: project.manager?._id || "",
      team:
        project.team?.map((member) =>
          typeof member === "string" ? member : member._id,
        ) || [],
      startDate: project.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      deadline: project.deadline
        ? new Date(project.deadline).toISOString().split("T")[0]
        : "",
      budget: project.budget ?? "",
      revenue: project.revenue ?? "",
      expense: project.expense ?? "",
      status: project.status || "new",
    });
  }, [project]);

  const managers = members.filter(
    (member) => member.role === "admin" || member.role === "manager",
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleTeamChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setForm((current) => ({
      ...current,
      team: selectedValues,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!form.client.trim()) {
      toast.error("Client name is required");
      return;
    }

    if (!form.startDate || !form.deadline) {
      toast.error("Start date and deadline are required");
      return;
    }

    if (new Date(form.deadline) < new Date(form.startDate)) {
      toast.error("Deadline cannot be before start date");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        client: form.client.trim(),
        description: form.description.trim(),
        manager: form.manager || null,
        team: form.team,
        startDate: form.startDate,
        deadline: form.deadline,
        budget: Number(form.budget) || 0,
        revenue: Number(form.revenue) || 0,
        expense: Number(form.expense) || 0,
        status: form.status,
      };

      const response = isEditing
        ? await api.patch(`/projects/${project._id}`, payload)
        : await api.post("/projects", payload);

      toast.success(
        isEditing
          ? "Project updated successfully"
          : "Project created successfully",
      );

      onSuccess?.(response.data.project);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>

          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Website Redesign"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>

          <Input
            id="client"
            name="client"
            value={form.client}
            onChange={handleChange}
            placeholder="Acme Corporation"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the project..."
          rows={4}
          disabled={submitting}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="manager">Project Manager</Label>

          <select
            id="manager"
            name="manager"
            value={form.manager}
            onChange={handleChange}
            disabled={submitting || loadingMembers}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select manager</option>

            {managers.map((member) => (
              <option key={member._id} value={member.user?._id}>
                {member.user?.name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={submitting}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="new">New</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="team">Team Members</Label>

        <select
          id="team"
          multiple
          value={form.team}
          onChange={handleTeamChange}
          disabled={submitting || loadingMembers}
          className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          {members.map((member) => (
            <option key={member._id} value={member.user?._id}>
              {member.user?.name} — {member.role}
            </option>
          ))}
        </select>

        <p className="text-xs text-muted-foreground">
          Hold Ctrl or Command to select multiple team members.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>

          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>

          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={form.deadline}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>

          <Input
            id="budget"
            name="budget"
            type="number"
            min="0"
            value={form.budget}
            onChange={handleChange}
            placeholder="0"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue">Revenue</Label>

          <Input
            id="revenue"
            name="revenue"
            type="number"
            min="0"
            value={form.revenue}
            onChange={handleChange}
            placeholder="0"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expense">Expense</Label>

          <Input
            id="expense"
            name="expense"
            type="number"
            min="0"
            value={form.expense}
            onChange={handleChange}
            placeholder="0"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {isEditing ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
