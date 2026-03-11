export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "in-progress" | "done";

export const DEFAULT_TAGS = ["Study", "Coding", "Assignment", "Personal", "Work", "Design"] as const;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: string; // ISO string
  tags: string[];
  createdAt: string;
}

export type SortOption = "created" | "priority" | "dueDate";
export type DueDateFilter = "all" | "today" | "this-week" | "overdue";

export interface Filters {
  priority: Priority | "all";
  status: Status | "all";
  dueDate: DueDateFilter;
  tag: string | "all";
  sort: SortOption;
}
