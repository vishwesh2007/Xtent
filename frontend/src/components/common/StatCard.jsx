import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  className = "",
}) => {
  const isPositive = trend >= 0;

  return (
    <div
      className={`rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            {value ?? "—"}
          </h3>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(description || trend !== undefined) && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(trend)}%
            </span>
          )}

          {trendLabel && (
            <span className="text-muted-foreground">{trendLabel}</span>
          )}

          {description && (
            <span className="text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
