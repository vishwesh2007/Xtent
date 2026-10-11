import { useEffect, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import ProjectForm from "@/components/projects/ProjectForm";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import EmptyState from "@/components/common/EmptyState";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await api.get("/projects");

      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleFormSuccess = (project) => {
    setDialogOpen(false);

    setProjects((currentProjects) => {
      const exists = currentProjects.some((item) => item._id === project._id);

      if (exists) {
        return currentProjects.map((item) =>
          item._id === project._id ? project : item,
        );
      }

      return [project, ...currentProjects];
    });
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${project._id}`);

      setProjects((currentProjects) =>
        currentProjects.filter((item) => item._id !== project._id),
      );

      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />

            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-96 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and monitor workspace projects.
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);

            if (!open) {
              setEditingProject(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create Project"}
              </DialogTitle>
            </DialogHeader>

            <ProjectForm
              project={editingProject}
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              All Projects
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {projects.length}
              </span>
            </CardTitle>

            <div className="flex items-center rounded-lg border p-1">
              <Button
                type="button"
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
              >
                <List className="mr-1.5 h-4 w-4" />
                Table
              </Button>

              <Button
                type="button"
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="mr-1.5 h-4 w-4" />
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start managing work in this workspace."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              }
            />
          ) : view === "table" ? (
            <ProjectTable
              projects={projects}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;
