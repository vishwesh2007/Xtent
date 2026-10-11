import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import StatusBadge from "@/components/common/StatusBadge";
import PriorityBadge from "@/components/common/PriorityBadge";

const columns = [
  {
    id: "pending",
    title: "Pending",
  },
  {
    id: "accepted",
    title: "Accepted",
  },
  {
    id: "in_progress",
    title: "In Progress",
  },
  {
    id: "completed",
    title: "Completed",
  },
  {
    id: "rejected",
    title: "Rejected",
  },
];

const KanbanBoard = ({ tasks = [], onStatusChange, onTaskClick }) => {
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const currentStatus = result.source.droppableId;

    if (currentStatus === newStatus) {
      return;
    }

    const task = tasks.find((item) => item._id === taskId);

    if (!task) {
      return;
    }

    onStatusChange?.(task, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid min-w-[1100px] grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div
              key={column.id}
              className="flex min-h-[500px] flex-col rounded-xl border bg-muted/30"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{column.title}</h3>

                  <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-1 flex-col gap-3 p-3 transition ${
                      snapshot.isDraggingOver ? "bg-blue-50/70" : ""
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <button
                            type="button"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onTaskClick?.(task)}
                            className={`w-full rounded-lg border bg-card p-4 text-left shadow-sm transition ${
                              snapshot.isDragging
                                ? "rotate-1 shadow-lg"
                                : "hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="line-clamp-2 text-sm font-medium">
                                {task.title}
                              </h4>
                            </div>

                            {task.description && (
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                                {task.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <PriorityBadge priority={task.priority} />

                              <StatusBadge status={task.status} />
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t pt-3">
                              <div className="min-w-0">
                                <p className="text-[11px] text-muted-foreground">
                                  Assigned to
                                </p>

                                <p className="truncate text-xs font-medium">
                                  {task.assignedTo?.name || "Unassigned"}
                                </p>
                              </div>

                              {task.dueDate && (
                                <p className="shrink-0 text-[11px] text-muted-foreground">
                                  {new Date(task.dueDate).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                    },
                                  )}
                                </p>
                              )}
                            </div>
                          </button>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-xs text-muted-foreground">
                          No tasks
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
