import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const statusColors = {
  pending: "#94a3b8",
  accepted: "#3b82f6",
  in_progress: "#f59e0b",
  completed: "#22c55e",
  rejected: "#ef4444",
};

const statusLabels = {
  pending: "Pending",
  accepted: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const TaskStatusDonut = ({ data = [], height = 280 }) => {
  const chartData = data
    .filter((item) => Number(item.value) > 0)
    .map((item) => ({
      ...item,
      name: item.name || statusLabels[item.status] || "Unknown",
      value: Number(item.value),
      status: item.status || item.name?.toLowerCase().replaceAll(" ", "_"),
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        No task data available
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="82%"
            paddingAngle={3}
            strokeWidth={0}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.status}
                fill={statusColors[entry.status] || "#64748b"}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold">{total}</span>

        <span className="text-xs text-muted-foreground">Total Tasks</span>
      </div>
    </div>
  );
};

export default TaskStatusDonut;
