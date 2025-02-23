import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/useMediaQuery";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskEditForm from "./form";
import { TableColumn, Task } from "@/lib/types";

export type TaskFormSubmitFn = (
  taskValues: Task | Omit<Task, "id">
) => Promise<void>;

export type TaskFormProps = {
  task?: Task;
  onSubmit: TaskFormSubmitFn;
  onClose: () => void;
  columns: TableColumn[];
};

const TaskForm = ({ task, onSubmit, onClose, columns }: TaskFormProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isEditMode = !!task?.id;
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task?.id) {
      setOpen(true);
    }
  }, [task?.id]);

  const handleSubmit: TaskFormSubmitFn = async (values) => {
    setIsSaving(true);
    toast.promise(onSubmit(values), {
      loading: "Saving task...",
      success: () => {
        setIsSaving(false);
        setOpen(false);
        onClose();
        return "Task saved successfully";
      },
      error: () => {
        setIsSaving(false);
        return "Failed to save task";
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
    setOpen(isOpen);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Task
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{`${isEditMode ? "Edit" : "Add"} Task`}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Make changes to your task here. Click save when you're done."
                : "Fill in the details of your new task below"}
            </DialogDescription>
          </DialogHeader>
          <TaskEditForm
            task={task}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            onClose={() => handleOpenChange(false)}
            columns={columns}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{`${isEditMode ? "Edit" : "Add"} Task`}</DrawerTitle>
          <DrawerDescription>
            {isEditMode
              ? "Make changes to your task here. Click save when you're done."
              : "Fill in the details of your new task below"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <TaskEditForm
            task={task}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            onClose={() => handleOpenChange(false)}
            columns={columns}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TaskForm;
