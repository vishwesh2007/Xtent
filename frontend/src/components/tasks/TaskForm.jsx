import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskForm = ({ task = null, projectId, onSuccess, onCancel }) => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [form, setForm] = useState({
    project: projectId || "",
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const loadData = async () => {
    try {
      setInitialLoading(true);

      const requests = [api.get("/members")];

      if (!projectId) {
        requests.push(api.get("/projects"));
      }

      const responses = await Promise.all(requests);

      const membersResponse = responses[0];

      setMembers(
        (membersResponse.data.members || []).filter(
          (member) => member.status === "active",
        ),
      );

      if (!projectId) {
        setProjects(responses[1].data.projects || []);
      }

      if (task) {
        setForm({
          project: task.project?._id || task.project || projectId || "",
          title: task.title || "",
          description: task.description || "",
          assignedTo: task.assignedTo?._id || task.assignedTo || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load task form data",
      );
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [task, projectId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.project) {
      toast.error("Please select a project");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        project: form.project,
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo || null,
        priority: form.priority,
        dueDate: form.dueDate || null,
      };

      let response;

      if (task) {
        response = await api.patch(`/tasks/${task._id}`, payload);

        toast.success("Task updated successfully");
      } else {
        response = await api.post("/tasks", payload);

        toast.success("Task created successfully");
      }

      onSuccess?.(response.data.task || response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-md bg-muted" />
        <div className="h-24 animate-pulse rounded-md bg-muted" />
        <div className="h-10 animate-pulse rounded-md bg-muted" />
        <div className="h-10 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!projectId && (
        <div className="space-y-2">
          <Label>Project</Label>

          <Select
            value={form.project}
            onValueChange={(value) =>
              setForm((current) => ({
                ...current,
                project: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="task-title">Task Title</Label>

        <Input
          id="task-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>

        <Textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task..."
          rows={4}
          disabled={loading}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Assign To</Label>

          <Select
            value={form.assignedTo || "unassigned"}
            onValueChange={(value) =>
              setForm((current) => ({
                ...current,
                assignedTo: value === "unassigned" ? "" : value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>

              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.user?.name || member.name || "Member"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>

          <Select
            value={form.priority}
            onValueChange={(value) =>
              setForm((current) => ({
                ...current,
                priority: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="low">Low</SelectItem>

              <SelectItem value="medium">Medium</SelectItem>

              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-due-date">Due Date</Label>

        <Input
          id="task-due-date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
