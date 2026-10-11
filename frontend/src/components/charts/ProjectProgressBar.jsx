import { useMemo } from "react";

import ProgressBar from "@/components/common/ProgressBar";

const ProjectProgressBar = ({ projects = [], limit = 6 }) => {
  const projectData = useMemo(() => {
    return [...projects]
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, limit);
  }, [projects, limit]);

  if (projectData.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
        No project data available
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {projectData.map((project) => (
        <div key={project._id}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {project.name || "Untitled Project"}
              </p>

              {project.client && (
                <p className="truncate text-xs text-muted-foreground">
                  {project.client}
                </p>
              )}
            </div>

            <span className="shrink-0 text-sm font-semibold">
              {project.progress || 0}%
            </span>
          </div>

          <ProgressBar value={project.progress || 0} size="sm" />
        </div>
      ))}
    </div>
  );
};

export default ProjectProgressBar;
