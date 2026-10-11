import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";
import EmptyState from "@/components/common/EmptyState";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ManagerDashboard = () => {
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
          <div className="h-8 w-52 animate-pulse rounded bg-muted" />
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

        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const projects = data?.projects || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Manager Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your projects, tasks, team, and progress.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="My Projects"
          value={stats.projects || 0}
          icon={BriefcaseBusiness}
          description="Projects under your management"
        />

        <StatCard
          title="Total Tasks"
          value={stats.tasks || 0}
          icon={ListTodo}
          description="Tasks across your projects"
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks || 0}
          icon={CheckCircle2}
          description="Successfully completed"
        />

        <StatCard
          title="Task Completion"
          value={`${stats.taskCompletionRate || 0}%`}
          icon={TrendingUp}
          description="Overall task completion"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <ProgressBar
              value={stats.taskCompletionRate || 0}
              label="Task Completion"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Pending</p>

                <p className="mt-1 text-xl font-semibold">
                  {stats.pendingTasks || 0}
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

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Delayed Projects
                </p>

                <p className="mt-1 text-xl font-semibold text-red-600">
                  {stats.delayedProjects || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <EmptyState
                title="No projects assigned"
                description="Projects managed by you will appear here."
                icon={BriefcaseBusiness}
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>My Projects</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Projects currently under your management.
              </p>
            </div>

            <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects"
              description="You currently have no projects assigned to you."
            />
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project._id} className="rounded-xl border p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {project.name}
                        </h3>

                        <StatusBadge status={project.status} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.client}
                      </p>
                    </div>

                    <div className="w-full md:max-w-xs">
                      <ProgressBar
                        value={project.progress || 0}
                        label="Progress"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
