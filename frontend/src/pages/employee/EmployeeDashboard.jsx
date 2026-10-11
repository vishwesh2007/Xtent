import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, ListTodo, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import StatCard from "@/components/common/StatCard";
import ProgressBar from "@/components/common/ProgressBar";
import StatusBadge from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/my");

      setData(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
          <div className="h-72 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const tasks = data?.tasks || [];
  const projects = data?.projects || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          My Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your tasks, projects, and performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Tasks"
          value={stats.tasks || 0}
          icon={ListTodo}
          description="Tasks assigned to you"
        />

        <StatCard
          title="Completed"
          value={stats.completedTasks || 0}
          icon={CheckCircle2}
          description="Tasks completed"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgressTasks || 0}
          icon={Clock3}
          description="Currently working"
        />

        <StatCard
          title="Completion Rate"
          value={`${stats.taskCompletionRate || 0}%`}
          icon={TrendingUp}
          description="Your task completion"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Task Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <ProgressBar
              value={stats.taskCompletionRate || 0}
              label="Completion"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Pending</p>

                <p className="mt-1 text-xl font-semibold">
                  {stats.pendingTasks || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Accepted</p>

                <p className="mt-1 text-xl font-semibold">
                  {stats.acceptedTasks || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">In Progress</p>

                <p className="mt-1 text-xl font-semibold">
                  {stats.inProgressTasks || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Completed</p>

                <p className="mt-1 text-xl font-semibold">
                  {stats.completedTasks || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <EmptyState
                title="No projects"
                description="Projects connected to your assigned tasks will appear here."
              />
            ) : (
              <div className="space-y-5">
                {projects.slice(0, 5).map((project) => (
                  <div key={project._id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {project.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {project.client}
                        </p>
                      </div>

                      <StatusBadge status={project.status} />
                    </div>

                    <ProgressBar value={project.progress || 0} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>

          <p className="text-sm text-muted-foreground">
            Your latest assigned tasks.
          </p>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks assigned"
              description="Tasks assigned to you will appear here."
            />
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 6).map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>

                    {task.project?.name && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {task.project.name}
                      </p>
                    )}
                  </div>

                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
