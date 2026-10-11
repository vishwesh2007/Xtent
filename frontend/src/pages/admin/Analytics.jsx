import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatCard from "@/components/common/StatCard";

const projectStatusData = [
  {
    name: "New",
    value: 4,
  },
  {
    name: "Running",
    value: 8,
  },
  {
    name: "Completed",
    value: 12,
  },
  {
    name: "Delayed",
    value: 3,
  },
];

const taskStatusData = [
  {
    name: "Pending",
    value: 8,
  },
  {
    name: "Accepted",
    value: 5,
  },
  {
    name: "In Progress",
    value: 14,
  },
  {
    name: "Completed",
    value: 28,
  },
];

const monthlyData = [
  {
    month: "Jan",
    projects: 4,
    completed: 2,
  },
  {
    month: "Feb",
    projects: 6,
    completed: 4,
  },
  {
    month: "Mar",
    projects: 7,
    completed: 5,
  },
  {
    month: "Apr",
    projects: 9,
    completed: 6,
  },
  {
    month: "May",
    projects: 11,
    completed: 8,
  },
  {
    month: "Jun",
    projects: 13,
    completed: 10,
  },
];

const projectColors = ["#94a3b8", "#3b82f6", "#22c55e", "#ef4444"];

const taskColors = ["#94a3b8", "#3b82f6", "#f59e0b", "#22c55e"];

const Analytics = () => {
  const totalProjects = projectStatusData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const completedProjects =
    projectStatusData.find((item) => item.name === "Completed")?.value || 0;

  const runningProjects =
    projectStatusData.find((item) => item.name === "Running")?.value || 0;

  const delayedProjects =
    projectStatusData.find((item) => item.name === "Delayed")?.value || 0;

  const totalTasks = taskStatusData.reduce((sum, item) => sum + item.value, 0);

  const completedTasks =
    taskStatusData.find((item) => item.name === "Completed")?.value || 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor project performance, task progress, and overall workspace
          activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          description="Across this workspace"
          icon={FolderKanban}
        />

        <StatCard
          title="Completed Projects"
          value={completedProjects}
          description="Successfully completed"
          icon={CheckCircle2}
        />

        <StatCard
          title="Running Projects"
          value={runningProjects}
          description="Currently active"
          icon={Clock3}
        />

        <StatCard
          title="Task Completion"
          value={`${completionRate}%`}
          description={`${completedTasks} of ${totalTasks} tasks completed`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>

            <CardDescription>
              Distribution of projects by current status.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={projectColors[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{totalProjects}</span>

                <span className="text-xs text-muted-foreground">Projects</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3">
              {projectStatusData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: projectColors[index],
                    }}
                  />

                  <span className="text-muted-foreground">{item.name}</span>

                  <span className="ml-auto font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>

            <CardDescription>
              Current distribution of workspace tasks.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={taskColors[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{totalTasks}</span>

                <span className="text-xs text-muted-foreground">Tasks</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3">
              {taskStatusData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: taskColors[index],
                    }}
                  />

                  <span className="text-muted-foreground">{item.name}</span>

                  <span className="ml-auto font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>

          <CardDescription>
            Project creation and completion trend over recent months.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="month" tickLine={false} axisLine={false} />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="projects"
                  name="Projects"
                  fill="#3b82f6"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#22c55e"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Performance</CardTitle>

            <CardDescription>
              High-level project performance indicators.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Project Completion
                </span>

                <span className="text-sm font-semibold">
                  {totalProjects > 0
                    ? Math.round((completedProjects / totalProjects) * 100)
                    : 0}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${
                      totalProjects > 0
                        ? (completedProjects / totalProjects) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Active Projects
                </span>

                <span className="text-sm font-semibold">
                  {totalProjects > 0
                    ? Math.round((runningProjects / totalProjects) * 100)
                    : 0}
                  %
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${
                      totalProjects > 0
                        ? (runningProjects / totalProjects) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Delayed Projects
                </span>

                <span className="text-sm font-semibold">{delayedProjects}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${
                      totalProjects > 0
                        ? (delayedProjects / totalProjects) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>

            <CardDescription>Workspace team activity summary.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4 rounded-xl border p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-lg font-semibold">Team Analytics</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Team productivity and resource utilization will be connected
                  to the AI analytics engine.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <BarChart3 className="h-5 w-5 text-primary" />

              <p className="text-sm text-muted-foreground">
                AI-powered productivity insights will help identify workload
                imbalance, resource risks, and performance trends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
