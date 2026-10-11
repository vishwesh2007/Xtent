import { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, ListTodo, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import api from "@/lib/api";

import TaskCard from "@/components/tasks/TaskCard";
import EmptyState from "@/components/common/EmptyState";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyTasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks/my");

      setTasks(response.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.project?.name?.toLowerCase().includes(query);

      const matchesStatus = status === "all" || task.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, status]);

  const handleTaskClick = (task) => {
    navigate(`/employee/tasks/${task._id}`);
  };

  const handleStatusChange = async (task, newStatus) => {
    const previousTasks = [...tasks];

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item._id === task._id ? { ...item, status: newStatus } : item,
      ),
    );

    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });

      toast.success("Task status updated");
    } catch (error) {
      setTasks(previousTasks);

      toast.error(
        error.response?.data?.message || "Failed to update task status",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and update the tasks assigned to you.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={status} onValueChange={setStatus}>
              <TabsList className="max-w-full overflow-x-auto">
                <TabsTrigger value="all">All</TabsTrigger>

                <TabsTrigger value="pending">Pending</TabsTrigger>

                <TabsTrigger value="accepted">Accepted</TabsTrigger>

                <TabsTrigger value="in_progress">In Progress</TabsTrigger>

                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="hidden rounded-lg border p-1 sm:flex">
              <Button
                type="button"
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title={tasks.length === 0 ? "No tasks assigned" : "No tasks found"}
          description={
            tasks.length === 0
              ? "Tasks assigned to you will appear here."
              : "Try changing your search or status filter."
          }
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={handleTaskClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="rounded-xl border bg-card p-4">
              <TaskCard task={task} onClick={handleTaskClick} />

              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                {[
                  ["pending", "Pending"],
                  ["accepted", "Accepted"],
                  ["in_progress", "In Progress"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={task.status === value ? "default" : "outline"}
                    disabled={task.status === value}
                    onClick={() => handleStatusChange(task, value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
