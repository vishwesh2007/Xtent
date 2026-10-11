import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Pencil,
  RefreshCw,
  UserRound,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";

import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";
import ProjectForm from "@/components/projects/ProjectForm";
import EmptyState from "@/components/common/EmptyState";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

      await api.post(`/projects/${id}/recalculate-progress`);

      await fetchProject();

      toast.success("Project progress recalculated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to recalculate progress",
      );
    } finally {
      setRecalculating(false);
    }
  };

  const handleUpdateSuccess = (updatedProject) => {
    setProject(updatedProject);
    setDialogOpen(false);
    fetchProject();
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not set";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-32 animate-pulse rounded bg-muted" />

        <div className="h-40 animate-pulse rounded-xl bg-muted" />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project could not be found in this workspace."
        action={
          <Button onClick={() => navigate("/admin/projects")}>
            Back to Projects
          </Button>
        }
      />
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/projects")}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRecalculate}
            disabled={recalculating}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${recalculating ? "animate-spin" : ""}`}
            />
            Recalculate
          </Button>

          <Button onClick={() => setDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        </div>
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

            <div className="w-full lg:max-w-xs">
              <ProgressBar
                value={project.progress || 0}
                label="Project Progress"
                size="lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>

              <p className="mt-1 text-sm font-semibold">
                {formatDate(project.deadline)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(project.revenue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Expense</p>

              <p className="mt-1 text-sm font-semibold">
                {formatCurrency(project.expense)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Team Members</p>

              <p className="mt-1 text-sm font-semibold">
                {project.team?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <span className="text-sm text-muted-foreground">Start Date</span>

              <span className="text-sm font-medium">
                {formatDate(project.startDate)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <span className="text-sm text-muted-foreground">Deadline</span>

              <span className="text-sm font-medium">
                {formatDate(project.deadline)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <span className="text-sm text-muted-foreground">Budget</span>

              <span className="text-sm font-semibold">
                {formatCurrency(project.budget)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b pb-4">
              <span className="text-sm text-muted-foreground">Revenue</span>

              <span className="text-sm font-semibold text-emerald-600">
                {formatCurrency(project.revenue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Expense</span>

              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(project.expense)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <UserRound className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Project Manager</p>

                <p className="text-sm font-medium">
                  {project.manager?.name || "Unassigned"}
                </p>

                {project.manager?.email && (
                  <p className="text-xs text-muted-foreground">
                    {project.manager.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium">Team Members</p>

              {project.team?.length ? (
                <div className="space-y-2">
                  {project.team.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {member.name
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
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
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Tasks</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {completedTasks} of {tasks.length} tasks completed
              </p>
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {project.progress || 0}%
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Tasks assigned to this project will appear here."
            />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Assigned to {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>

                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          <ProjectForm
            project={project}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetails;
