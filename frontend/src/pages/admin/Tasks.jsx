import { useEffect, useState } from "react";
import { KanbanSquare, List, Plus } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import EmptyState from "@/components/common/EmptyState";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("kanban");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tasks");

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

  const handleCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleFormSuccess = (task) => {
    setDialogOpen(false);

    setTasks((currentTasks) => {
      const exists = currentTasks.some((item) => item._id === task._id);

      if (exists) {
        return currentTasks.map((item) =>
          item._id === task._id ? task : item,
        );
      }

      return [task, ...currentTasks];
    });
  };

  const handleStatusChange = async (task, newStatus) => {
    const previousStatus = task.status;

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item._id === task._id
          ? {
              ...item,
              status: newStatus,
            }
          : item,
      ),
    );

    try {
      const response = await api.patch(`/tasks/${task._id}/status`, {
        status: newStatus,
      });

      const updatedTask = response.data.task;

      if (updatedTask) {
        setTasks((currentTasks) =>
          currentTasks.map((item) =>
            item._id === updatedTask._id ? updatedTask : item,
          ),
        );
      }

      toast.success("Task status updated");
    } catch (error) {
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item._id === task._id
            ? {
                ...item,
                status: previousStatus,
              }
            : item,
        ),
      );

      toast.error(
        error.response?.data?.message || "Failed to update task status",
      );
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

        <div className="h-[550px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage workspace tasks and track their progress.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              All Tasks
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {tasks.length}
              </span>
            </CardTitle>

            <div className="flex items-center rounded-lg border p-1">
              <Button
                type="button"
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("kanban")}
              >
                <KanbanSquare className="mr-1.5 h-4 w-4" />
                Board
              </Button>

              <Button
                type="button"
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
              >
                <List className="mr-1.5 h-4 w-4" />
                List
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Create a task and assign it to a workspace member."
              action={
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              }
            />
          ) : view === "kanban" ? (
            <div className="overflow-x-auto pb-2">
              <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onTaskClick={handleTaskClick}
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={handleTaskClick}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditingTask(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create Task"}
            </DialogTitle>
          </DialogHeader>

          <TaskForm
            task={editingTask}
            onSuccess={handleFormSuccess}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
