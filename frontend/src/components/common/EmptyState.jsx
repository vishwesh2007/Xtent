import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "There is no data to display.",
  icon: Icon = Inbox,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-base font-semibold">{title}</h3>

      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
