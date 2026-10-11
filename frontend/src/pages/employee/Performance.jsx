import { CheckCircle2, Clock3, ListChecks, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatCard from "@/components/common/StatCard";

const Performance = () => {
  const stats = {
    completed: 24,
    inProgress: 6,
    pending: 4,
    completionRate: 91,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Performance
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your task completion and overall work performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          description="Tasks completed"
          icon={CheckCircle2}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          description="Currently working"
          icon={Clock3}
        />

        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          description="Waiting to be completed"
          icon={ListChecks}
        />

        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          description="Overall task completion"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Performance</CardTitle>

            <CardDescription>
              Your current task completion performance.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>

                  <span className="text-sm font-semibold">
                    {stats.completionRate}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${stats.completionRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Completed</p>

                  <p className="mt-1 text-xl font-semibold">
                    {stats.completed}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">In Progress</p>

                  <p className="mt-1 text-xl font-semibold">
                    {stats.inProgress}
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Pending</p>

                  <p className="mt-1 text-xl font-semibold">{stats.pending}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>

            <CardDescription>
              Your current contribution to the workspace.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-5 rounded-xl border p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">
                  {stats.completionRate}
                </span>
              </div>

              <div>
                <p className="text-base font-semibold">Strong Performance</p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Your task completion rate is currently {stats.completionRate}
                  %. Keep maintaining consistent progress across your assigned
                  tasks.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium">
                Edge AI Performance Analysis
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                AI-powered productivity analysis will identify workload
                patterns, task completion trends, and resource utilization.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>

          <CardDescription>
            Areas that can help improve your productivity.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-5">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <h3 className="mt-3 text-sm font-semibold">Task Completion</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Maintain consistent progress on assigned tasks.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <Clock3 className="h-5 w-5 text-amber-600" />

              <h3 className="mt-3 text-sm font-semibold">Deadlines</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Prioritize tasks approaching their deadlines.
              </p>
            </div>

            <div className="rounded-xl border p-5">
              <TrendingUp className="h-5 w-5 text-primary" />

              <h3 className="mt-3 text-sm font-semibold">Productivity</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                AI insights will track productivity trends over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Performance;
