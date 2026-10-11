import { CalendarDays, MoreHorizontal, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "@/components/common/StatusBadge";
import ProgressBar from "@/components/common/ProgressBar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectTable = ({ projects = [], onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) {
      return "No deadline";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (projects.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="w-12 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project._id}
                className="cursor-pointer"
                onClick={() => navigate(`/admin/projects/${project._id}`)}
              >
                <TableCell>
                  <div className="min-w-48">
                    <p className="font-medium">{project.name}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {project.client || "No client"}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />

                    <span className="text-sm">
                      {project.manager?.name || "Unassigned"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div
                    className="w-40"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ProgressBar value={project.progress || 0} size="sm" />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />

                    <span className="text-sm">
                      {formatDate(project.deadline)}
                    </span>
                  </div>
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/projects/${project._id}`)
                        }
                      >
                        View Details
                      </DropdownMenuItem>

                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(project)}>
                          Edit Project
                        </DropdownMenuItem>
                      )}

                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(project)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete Project
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectTable;
