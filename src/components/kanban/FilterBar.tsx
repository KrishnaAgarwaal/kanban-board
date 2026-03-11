import { Filters, Priority, Status, DueDateFilter, SortOption } from "@/types/task";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  allTags: string[];
}

export const FilterBar = ({ filters, setFilters, allTags }: Props) => {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters({ ...filters, [key]: value });

  const hasActive = filters.priority !== "all" || filters.status !== "all" || filters.dueDate !== "all" || filters.tag !== "all" || filters.sort !== "created";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
        <SlidersHorizontal size={14} />
        <span className="text-xs font-medium">Filters</span>
        {hasActive && (
          <button
            onClick={() => setFilters({ priority: "all", status: "all", dueDate: "all", tag: "all", sort: "created" })}
            className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 hover:bg-primary/20"
          >
            Reset
          </button>
        )}
      </div>

      <Select value={filters.priority} onValueChange={(v) => update("priority", v as Priority | "all")}>
        <SelectTrigger className="h-8 w-[110px] text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => update("status", v as Status | "all")}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.dueDate} onValueChange={(v) => update("dueDate", v as DueDateFilter)}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Due Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Due Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      {allTags.length > 0 && (
        <Select value={filters.tag} onValueChange={(v) => update("tag", v)}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={filters.sort} onValueChange={(v) => update("sort", v as SortOption)}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created">Newest First</SelectItem>
          <SelectItem value="priority">By Priority</SelectItem>
          <SelectItem value="dueDate">By Due Date</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
