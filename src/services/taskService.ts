import { Task, Status, Priority } from "@/types/task";

const STORAGE_KEY = "kanban-tasks";

const load = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const save = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  getAll: (): Task[] => load(),

  create: (data: { title: string; description: string; priority: Priority; dueDate?: string; tags: string[] }): Task => {
    const tasks = load();
    const task: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      status: "todo",
      priority: data.priority,
      dueDate: data.dueDate,
      tags: data.tags,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    save(tasks);
    return task;
  },

  update: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Task | null => {
    const tasks = load();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    save(tasks);
    return tasks[idx];
  },

  delete: (id: string): boolean => {
    const tasks = load();
    const filtered = tasks.filter((t) => t.id !== id);
    if (filtered.length === tasks.length) return false;
    save(filtered);
    return true;
  },

  moveTask: (id: string, status: Status): Task | null => {
    return taskService.update(id, { status });
  },
};
