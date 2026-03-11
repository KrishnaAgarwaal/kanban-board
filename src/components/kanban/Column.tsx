import { Droppable } from "@hello-pangea/dnd";
import { Task, Status } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";

const columnConfig: Record<Status, { title: string; color: string; dotColor: string }> = {
  todo: { title: "To Do", color: "bg-column-todo", dotColor: "bg-primary" },
  "in-progress": { title: "In Progress", color: "bg-column-progress", dotColor: "bg-priority-medium" },
  done: { title: "Done", color: "bg-column-done", dotColor: "bg-priority-low" },
};

interface Props {
  status: Status;
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  onDelete: (id: string) => void;
  onAdd?: () => void;
}

export const Column = ({ status, tasks, onUpdate, onDelete, onAdd }: Props) => {
  const { title, color, dotColor } = columnConfig[status];

  return (
    <div className={`flex flex-col rounded-xl ${color} p-3 min-h-[200px]`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          <h3 className="font-body font-semibold text-sm text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-medium bg-background/60 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        {status === "todo" && onAdd && (
          <button onClick={onAdd} className="p-1 rounded-md hover:bg-background/60 text-muted-foreground hover:text-foreground transition-colors">
            <Plus size={16} />
          </button>
        )}
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-background/40" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
