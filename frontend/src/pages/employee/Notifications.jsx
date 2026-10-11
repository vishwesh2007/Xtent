import { Bell, CheckCircle2, Clock3, Info, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const notifications = [
  {
    id: 1,
    type: "task",
    title: "New task assigned",
    description: "A new task has been assigned to you.",
    time: "Today",
    icon: Bell,
  },
  {
    id: 2,
    type: "completed",
    title: "Task completed",
    description: "Your task status was successfully updated.",
    time: "Yesterday",
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "deadline",
    title: "Upcoming deadline",
    description: "You have a task approaching its deadline.",
    time: "2 days ago",
    icon: Clock3,
  },
  {
    id: 4,
    type: "info",
    title: "Workspace update",
    description: "Your workspace has received a new update.",
    time: "3 days ago",
    icon: Info,
  },
];

const iconStyles = {
  task: "bg-blue-50 text-blue-600",
  completed: "bg-green-50 text-green-600",
  deadline: "bg-amber-50 text-amber-600",
  info: "bg-slate-100 text-slate-600",
};

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Stay updated with your tasks, deadlines, and workspace activity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>

          <CardDescription>
            Your latest workspace and task updates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">No notifications</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                You're all caught up.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notification.icon;

                return (
                  <div
                    key={notification.id}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        iconStyles[notification.type]
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-sm font-semibold">
                          {notification.title}
                        </h3>

                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium">You're up to date</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Real-time notifications will be connected to the Edge notification
              system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
