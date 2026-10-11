import { CalendarDays, UserRound } from "lucide-react";

import PriorityBadge from "@/components/common/PriorityBadge";
import StatusBadge from "@/components/common/StatusBadge";

const TaskCard = ({ task, showProject = true, onClick }) => {
  const dueDate = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No due date";

  return (
    <button
      type="button"
      onClick={() => onClick?.(task)}
      className="w-full rounded-xl border bg-card p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold">
            {task?.title || "Untitled Task"}
          </h3>

          {showProject && task?.project?.name && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {task.project.name}
            </p>
          )}
        </div>

        <StatusBadge status={task?.status} />
      </div>

      {task?.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <PriorityBadge priority={task?.priority} />
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Assigned to</p>

            <p className="truncate text-xs font-medium">
              {task?.assignedTo?.name || "Unassigned"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />

          <span className="text-xs font-medium">{dueDate}</span>
        </div>
      </div>
    </button>
  );
};

export default TaskCard;
