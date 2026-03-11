import { Priority } from "@/types/task";

const config: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-priority-low/15 text-priority-low" },
  medium: { label: "Medium", className: "bg-priority-medium/15 text-priority-medium" },
  high: { label: "High", className: "bg-priority-high/15 text-priority-high" },
};

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const { label, className } = config[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};
