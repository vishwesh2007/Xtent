import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";

import PriorityBadge from "@/components/common/PriorityBadge";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/tasks/${id}`);

      setTask(response.data.task);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusChange = async (status) => {
    if (!task || status === task.status) {
      return;
    }

    try {
      setUpdating(true);

      const response = await api.patch(`/tasks/${id}/status`, { status });

      setTask(response.data.task);

      toast.success("Task status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task status",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />

        <div className="h-64 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Task not found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            This task may have been removed or you may not have access to it.
          </p>

          <Button className="mt-4" onClick={() => navigate("/employee/tasks")}>
            Back to My Tasks
          </Button>
        </div>
      </div>
    );
  }

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No due date";

  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const statusProgress = {
    pending: 0,
    accepted: 25,
    in_progress: 60,
    completed: 100,
    rejected: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => navigate("/employee/tasks")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Tasks
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {task.title}
                </h1>

                <StatusBadge status={task.status} />
              </div>

              {task.project?.name && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {task.project.name}
                </p>
              )}

              {task.description && (
                <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            <div className="w-full lg:w-52">
              <p className="mb-2 text-xs text-muted-foreground">
                Update Status
              </p>

              <Select
                value={task.status}
                onValueChange={handleStatusChange}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>

                  <SelectItem value="accepted">Accepted</SelectItem>

                  <SelectItem value="in_progress">In Progress</SelectItem>

                  <SelectItem value="completed">Completed</SelectItem>

                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <ProgressBar
              value={statusProgress[task.status] || 0}
              label="Task Progress"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Status
              </span>

              <StatusBadge status={task.status} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Priority
              </span>

              <PriorityBadge priority={task.priority} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Due Date
              </span>

              <span className="text-sm font-medium">{dueDate}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Created</span>

              <span className="text-sm font-medium">{createdDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">Assigned To</p>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {task.assignedTo?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {task.assignedTo?.name || "Unassigned"}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {task.assignedTo?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-muted-foreground">Project</p>

              <div className="mt-2 flex items-center gap-2">
                <UserRound className="h-4 w-4 text-muted-foreground" />

                <p className="text-sm font-medium">
                  {task.project?.name || "No project"}
                </p>
              </div>

              {task.project?.client && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Client: {task.project.client}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {task.project && (
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Project</p>

                <p className="mt-1 text-sm font-medium">{task.project.name}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Client</p>

                <p className="mt-1 text-sm font-medium">
                  {task.project.client || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Project Status</p>

                <div className="mt-1">
                  <StatusBadge status={task.project.status} />
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Project Progress
                </p>

                <div className="mt-2">
                  <ProgressBar value={task.project.progress || 0} size="sm" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskDetails;
