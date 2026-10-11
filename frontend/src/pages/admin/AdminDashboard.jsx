import { useEffect, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  DollarSign,
  FolderKanban,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";
import EmptyState from "@/components/common/EmptyState";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard/stats");

      setStats(response.data.stats);
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  const projectStats = stats?.projects || {};
  const taskStats = stats?.tasks || {};
  const teamStats = stats?.team || {};
  const financialStats = stats?.financial || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your workspace, projects, team, and business performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={projectStats.total || 0}
          icon={BriefcaseBusiness}
          description={`${projectStats.running || 0} currently running`}
        />

        <StatCard
          title="Completed Projects"
          value={projectStats.completed || 0}
          icon={CheckCircle2}
          description={`${projectStats.delayed || 0} delayed`}
        />

        <StatCard
          title="Total Tasks"
          value={taskStats.total || 0}
          icon={FolderKanban}
          description={`${taskStats.completed || 0} completed`}
        />

        <StatCard
          title="Active Members"
          value={teamStats.activeMembers || 0}
          icon={Users}
          description="Workspace members"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Task Completion"
          value={`${taskStats.completionRate || 0}%`}
          icon={CheckCircle2}
          description={`${taskStats.inProgress || 0} tasks in progress`}
        />

        <StatCard
          title="Project Progress"
          value={`${stats?.averageProjectProgress || 0}%`}
          icon={Activity}
          description="Average project progress"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(financialStats.revenue)}
          icon={DollarSign}
          description="Across all projects"
        />

        <StatCard
          title="Total Expense"
          value={formatCurrency(financialStats.expense)}
          icon={DollarSign}
          description={`Profit ${formatCurrency(financialStats.profit)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">New</p>

                <p className="mt-1 text-xl font-semibold">
                  {projectStats.new || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Running</p>

                <p className="mt-1 text-xl font-semibold">
                  {projectStats.running || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Completed</p>

                <p className="mt-1 text-xl font-semibold">
                  {projectStats.completed || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Delayed</p>

                <p className="mt-1 text-xl font-semibold text-red-600">
                  {projectStats.delayed || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Cancelled</p>

                <p className="mt-1 text-xl font-semibold">
                  {projectStats.cancelled || 0}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Budget</p>

                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(financialStats.budget)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm font-medium">Task Completion</span>
                </div>

                <span className="text-sm font-semibold">
                  {taskStats.completionRate || 0}%
                </span>
              </div>

              <ProgressBar
                value={taskStats.completionRate || 0}
                showValue={false}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>

                <p className="mt-1 text-xl font-semibold">
                  {formatCurrency(financialStats.budget)}
                </p>
              </div>

              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>

                <p className="mt-1 text-xl font-semibold text-emerald-600">
                  {formatCurrency(financialStats.revenue)}
                </p>
              </div>

              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Expense</p>

                <p className="mt-1 text-xl font-semibold text-red-600">
                  {formatCurrency(financialStats.expense)}
                </p>
              </div>

              <DollarSign className="h-5 w-5 text-red-600" />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>

                <p className="mt-1 text-2xl font-semibold">
                  {formatCurrency(financialStats.profit)}
                </p>
              </div>

              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Projects</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Current workspace project performance.
              </p>
            </div>

            <span className="text-sm text-muted-foreground">
              {projects.length} projects
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create a project to start tracking workspace performance."
              icon={BriefcaseBusiness}
            />
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 8).map((project) => (
                <div
                  key={project._id}
                  className="rounded-xl border p-4 transition hover:bg-muted/30"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">
                          {project.name}
                        </h3>

                        <StatusBadge status={project.status} />
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {project.client || "No client"}
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

export default AdminDashboard;
