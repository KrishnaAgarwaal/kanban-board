import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2, CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "@/types/task";
import { PriorityBadge } from "./PriorityBadge";
import { TaskFormDialog } from "./TaskFormDialog";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, startOfDay, isToday } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  task: Task;
  index: number;
  onUpdate: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, index, onUpdate, onDelete }: Props) => {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isOverdue = task.dueDate && isBefore(new Date(task.dueDate), startOfDay(new Date())) && task.status !== "done";
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`group rounded-lg border bg-card p-3 shadow-sm transition-shadow cursor-grab active:cursor-grabbing ${
              snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:shadow-md"
            } ${isOverdue ? "border-destructive/40" : ""}`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className="font-medium text-sm truncate text-card-foreground cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setExpanded(!expanded)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                      {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                      <Pencil size={13} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                          <Trash2 size={13} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete task?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(task.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {!expanded && task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                )}

                {expanded && (
                  <div className="mt-2 space-y-2">
                    {task.description && (
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    )}
                    <div className="text-[10px] text-muted-foreground">
                      Created {format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <PriorityBadge priority={task.priority} />
                  {task.dueDate && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      isOverdue ? "bg-destructive/15 text-destructive" : isDueToday ? "bg-priority-medium/15 text-priority-medium" : "bg-muted text-muted-foreground"
                    }`}>
                      <CalendarIcon size={10} />
                      {format(new Date(task.dueDate), "MMM d")}
                    </span>
                  )}
                  {task.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      <TaskFormDialog
        open={editing}
        onOpenChange={setEditing}
        initialData={{ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate, tags: task.tags || [] }}
        onSubmit={(data) => {
          onUpdate(task.id, data);
          setEditing(false);
        }}
        mode="edit"
      />
    </>
  );
};
