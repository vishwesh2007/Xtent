import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Grid2X2, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import EmptyState from "@/components/common/EmptyState";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);

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

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !search.trim() ||
        project.name?.toLowerCase().includes(search.toLowerCase()) ||
        project.client?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || project.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  const handleProjectClick = (project) => {
    navigate(`/manager/projects/${project._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            My Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor projects assigned to you.
          </p>
        </div>

        <Button onClick={() => navigate("/manager/projects")}>
          <Plus className="mr-2 h-4 w-4" />
          Projects
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          className="w-full lg:max-w-sm"
        />

        <div className="flex items-center gap-2">
          <Tabs value={status} onValueChange={setStatus}>
            <TabsList className="w-full overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>

              <TabsTrigger value="new">New</TabsTrigger>

              <TabsTrigger value="running">Running</TabsTrigger>

              <TabsTrigger value="completed">Completed</TabsTrigger>

              <TabsTrigger value="delayed">Delayed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="hidden rounded-lg border p-1 sm:flex">
            <Button
              type="button"
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title={
            projects.length === 0 ? "No projects assigned" : "No projects found"
          }
          description={
            projects.length === 0
              ? "Projects assigned to you will appear here."
              : "Try changing your search or status filter."
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onView={handleProjectClick}
          onEdit={() => toast.info("Project editing will be available here.")}
          onDelete={() =>
            toast.info("Project deletion is restricted to administrators.")
          }
        />
      )}
    </div>
  );
};

export default MyProjects;
