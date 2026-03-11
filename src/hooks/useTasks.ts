import { useState, useCallback, useMemo } from "react";
import { Task, Status, Priority, Filters, SortOption, DueDateFilter } from "@/types/task";
import { taskService } from "@/services/taskService";
import { isToday, isThisWeek, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => taskService.getAll());
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    priority: "all",
    status: "all",
    dueDate: "all",
    tag: "all",
    sort: "created",
  });

  const refresh = () => setTasks(taskService.getAll());

  const createTask = useCallback((data: { title: string; description: string; priority: Priority; dueDate?: string; tags: string[] }) => {
    taskService.create(data);
    refresh();
    toast.success("Task created", { description: data.title });
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    taskService.update(id, updates);
    refresh();
    toast.info("Task updated");
  }, []);

  const deleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    taskService.delete(id);
    refresh();
    toast.error("Task deleted", { description: task?.title });
  }, [tasks]);

  const moveTask = useCallback((id: string, status: Status) => {
    const statusLabels: Record<Status, string> = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
    taskService.moveTask(id, status);
    refresh();
    toast.success(`Moved to ${statusLabels[status]}`);
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(t => t.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filters.priority !== "all") {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.status !== "all") {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.tag !== "all") {
      result = result.filter(t => t.tags?.includes(filters.tag));
    }
    if (filters.dueDate !== "all") {
      const now = startOfDay(new Date());
      result = result.filter(t => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        switch (filters.dueDate) {
          case "today": return isToday(due);
          case "this-week": return isThisWeek(due, { weekStartsOn: 1 });
          case "overdue": return isBefore(due, now);
          default: return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case "priority":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, searchQuery, filters]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    allTags,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
  };
};
