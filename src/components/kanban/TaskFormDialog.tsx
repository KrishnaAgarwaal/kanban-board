import { useState, useEffect } from "react";
import { Priority, DEFAULT_TAGS } from "@/types/task";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

export interface FormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  tags: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  mode: "create" | "edit";
}

export const TaskFormDialog = ({ open, onOpenChange, onSubmit, initialData, mode }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : undefined);
      setTags(initialData.tags || []);
    } else if (open) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(undefined);
      setTags([]);
    }
    setCustomTag("");
  }, [open, initialData]);

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
    }
    setCustomTag("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate?.toISOString(),
      tags,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{mode === "create" ? "New Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

          <div className="grid grid-cols-2 gap-3">
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "MMM d") : "Due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {tags.filter(t => !DEFAULT_TAGS.includes(t as any)).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.filter(t => !DEFAULT_TAGS.includes(t as any)).map(tag => (
                  <Badge key={tag} variant="default" className="text-xs gap-1">
                    {tag}
                    <X size={10} className="cursor-pointer" onClick={() => toggleTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTag(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomTag} disabled={!customTag.trim()}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>{mode === "create" ? "Create" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
