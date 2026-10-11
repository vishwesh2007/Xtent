import { Badge } from "@/components/ui/badge";

const statusConfig = {
  new: {
    label: "New",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  running: {
    label: "Running",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
  delayed: {
    label: "Delayed",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  accepted: {
    label: "Accepted",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  in_progress: {
    label: "In Progress",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const StatusBadge = ({ status, className = "" }) => {
  const config = statusConfig[status] || {
    label: status || "Unknown",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
