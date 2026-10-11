import { Badge } from "@/components/ui/badge";

const priorityConfig = {
  low: {
    label: "Low",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  },
  medium: {
    label: "Medium",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  high: {
    label: "High",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const PriorityBadge = ({ priority, className = "" }) => {
  const config = priorityConfig[priority] || {
    label: priority || "Unknown",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <Badge variant="outline" className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;
