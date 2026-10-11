import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  ListTodo,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";

import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";
import ProgressBar from "@/components/common/ProgressBar";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/projects/${id}`);

      setProject(response.data.project);
      setTasks(response.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);

      const response = await api.post(`/projects/${id}/recalculate-progress`);

      setProject(response.data.project);

      toast.success("Project progress updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to recalculate progress",
      );
    } finally {
      setRecalculating(false);
    }
  };

  const handleTaskCreated = async () => {
    setTaskDialogOpen(false);
    await fetchProject();
  };

  const handleTaskStatusChange = async (task, status) => {
    try {
      await api.patch(`/tasks/${task._id}/status`, { status });

      await fetchProject();

      toast.success("Task status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />

        <div className="h-56 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Project not found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The project may have been removed or you may not have access to it.
          </p>

          <Button
            className="mt-4"
            onClick={() => navigate("/manager/projects")}
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const deadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  const startDate = project.startDate
    ? new Date(project.startDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "accepted",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => navigate("/manager/projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.name}
                </h1>

                <StatusBadge status={project.status} />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {project.client}
              </p>

              {project.description && (
                <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleRecalculate}
              disabled={recalculating}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {recalculating ? "Updating..." : "Recalculate Progress"}
            </Button>
          </div>

          <div className="mt-6">
            <ProgressBar
              value={project.progress || 0}
              label="Project Progress"
            />
          </div>

          <Separator className="my-6" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>

                <p className="text-sm font-medium">{startDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>

                <p className="text-sm font-medium">{deadline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Team Members</p>

                <p className="text-sm font-medium">
                  {project.team?.length || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ListTodo className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Total Tasks</p>

                <p className="text-sm font-medium">{tasks.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Tasks</p>

              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{tasks.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Completed</p>

              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{completedTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">In Progress</p>

              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{inProgressTasks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pending</p>

              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{pendingTasks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Budget</span>

              <span className="font-semibold">
                ₹{(project.budget || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Revenue</span>

              <span className="font-semibold">
                ₹{(project.revenue || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expense</span>

              <span className="font-semibold">
                ₹{(project.expense || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium">
                <CircleDollarSign className="h-4 w-4" />
                Net
              </span>

              <span className="font-semibold">
                ₹
                {(
                  (project.revenue || 0) - (project.expense || 0)
                ).toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>

          <CardContent>
            {project.team?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {project.team.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {member.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No team members assigned.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Project Tasks</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage tasks for this project.
              </p>
            </div>

            <Button onClick={() => setTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <ListTodo className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">No tasks yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create the first task for this project.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  showProject={false}
                  onClick={() =>
                    navigate(`/manager/projects/${id}?task=${task._id}`)
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>

          <TaskForm
            projectId={id}
            onSuccess={handleTaskCreated}
            onCancel={() => setTaskDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
