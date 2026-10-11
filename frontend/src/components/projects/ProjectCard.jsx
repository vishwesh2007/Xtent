import { CalendarDays, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const deadline = project?.deadline
    ? new Date(project.deadline).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  const managerName = project?.manager?.name || "Unassigned";

  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/projects/${project._id}`)}
      className="w-full rounded-xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">
            {project?.name || "Untitled Project"}
          </h3>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {project?.client || "No client"}
          </p>
        </div>

        <StatusBadge status={project?.status} />
      </div>

      {project?.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
      )}

      <div className="mt-5">
        <ProgressBar
          value={project?.progress || 0}
          label="Progress"
          size="sm"
        />
      </div>

      <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2">
          <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Manager</p>

            <p className="truncate text-sm font-medium">{managerName}</p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />

          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Deadline</p>

            <p className="truncate text-sm font-medium">{deadline}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProjectCard;
