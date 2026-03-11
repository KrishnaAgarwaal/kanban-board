import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Status } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { Column } from "./Column";
import { TaskFormDialog } from "./TaskFormDialog";
import { FilterBar } from "./FilterBar";
import { Search, Plus, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const columns: Status[] = ["todo", "in-progress", "done"];

export const Board = () => {
  const { tasks, allTags, createTask, updateTask, deleteTask, moveTask, searchQuery, setSearchQuery, filters, setFilters } = useTasks();
  const [showCreate, setShowCreate] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    if (newStatus !== result.source.droppableId) {
      moveTask(result.draggableId, newStatus);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutDashboard size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display text-foreground">Kanban Board</h1>
              <p className="text-xs text-muted-foreground font-body">Manage your workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <ThemeToggle />
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-1.5">
              <Plus size={14} />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3">
          <FilterBar filters={filters} setFilters={setFilters} allTags={allTags} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onAdd={status === "todo" ? () => setShowCreate(true) : undefined}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      <TaskFormDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={(data) => createTask(data)}
        mode="create"
      />
    </div>
  );
};
