const ProgressBar = ({
  value = 0,
  label,
  showValue = true,
  size = "default",
  className = "",
}) => {
  const progress = Math.min(100, Math.max(0, Number(value) || 0));

  const sizeClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}

          {showValue && (
            <span className="text-sm font-medium text-muted-foreground">
              {progress}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full overflow-hidden rounded-full bg-muted ${sizeClass}`}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
