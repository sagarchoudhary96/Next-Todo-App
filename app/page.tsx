"use client";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import CustomFieldCreate from "@/components/CustomFieldForm";
import KanbanView from "@/components/KanbanView"; // Import KanbanView
import TableView from "@/components/TableView";
import TaskForm, { TaskFormSubmitFn } from "@/components/TaskForm";
import { Button } from "@/components/ui/button"; // Import Button
import initialTodos from "@/data/todo.json";
import useLocalStorage from "@/hooks/useLocalStorage";
import useTaskSchema from "@/hooks/useTaskSchema";
import { TableColumn, Task } from "@/lib/types";
import { LayoutGrid, List, Loader2Icon } from "lucide-react"; // Import icons
import { useState } from "react";
import { toast } from "sonner";

// Define LayoutMode type
type LayoutMode = "table" | "kanban";

export default function Home() {
  // State for layout mode
  const [layoutMode, setLayoutMode] = useLocalStorage<LayoutMode>(
    "layoutMode",
    "table"
  );
  const [todoList, setTodoList] = useLocalStorage<Task[]>(
    "todoList",
    initialTodos
  );
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task>();
  const [fieldToEdit, setFieldToEdit] = useState<TableColumn>();
  const [fieldToDelete, setFieldToDelete] = useState<TableColumn | null>(null);
  const { taskColumns, addNewColumn, removeColumn, updateColumn, isLoaded } =
    useTaskSchema();
  const onTaskSubmit: TaskFormSubmitFn = async (taskValues): Promise<void> => {
    if (taskToEdit) {
      setTodoList((prev) =>
        prev.map((todo) =>
          todo.id === taskToEdit.id ? { ...todo, ...taskValues } : todo
        )
      );
      setTaskToEdit(undefined);
    } else {
      setTodoList((prev) => [
        {
          ...taskValues,
          id: todoList.length + 1,
        } as Task,
        ...prev,
      ]);
    }
  };

  const handleTaskDelete = () => {
    if (!taskToDelete) return;
    toast.promise(
      new Promise<void>((resolve) => {
        setTodoList((prev) => prev.filter((todo) => todo.id !== taskToDelete));
        setTaskToDelete(null);
        resolve();
      }),
      {
        loading: "Deleting task...",
        success: "Task deleted successfully",
        error: "Failed to delete task",
      }
    );
  };

  const handleFieldDelete = () => {
    if (!fieldToDelete) return;
    toast.promise(
      new Promise<void>((resolve) => {
        removeColumn(fieldToDelete.key);
        setFieldToDelete(null);
        resolve();
      }),
      {
        loading: "Deleting Field...",
        success: "Field deleted successfully",
        error: "Failed to delete field",
      }
    );
  };

  const handleCustomFieldSubmit = async (
    newFieldValues: TableColumn | Omit<TableColumn, "key">
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (fieldToEdit) {
        updateColumn(fieldToEdit.key, newFieldValues);
        setFieldToEdit(undefined);
        resolve();
      } else {
        const newColumnKey = newFieldValues.title
          .toLowerCase()
          .replace(" ", "_");
        if (taskColumns.some((col) => col.key === newColumnKey)) {
          reject("Column with same Title already exists");
        } else {
          addNewColumn({
            ...newFieldValues,
            key: newFieldValues.title.toLowerCase().replace(" ", "_"),
          });
          resolve();
        }
      }
    });
  };

  // Handler to update a task (used by KanbanView)
  const handleUpdateTask = (updatedTask: Task) => {
    setTodoList((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
     // Optional: Add toast notification for task update
     // toast.success("Task updated");
  };


  // Show loader if schema is not loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="h-full w-full items-center justify-center flex">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center w-full sm:justify-between mb-4 gap-4"> {/* Increased gap */}
        <h1 className="text-2xl font-bold">Tasks - {todoList.length}</h1>
        <div className="flex gap-2 items-center self-end">
           {/* Layout Switcher */}
           <div className="flex gap-1 border p-1 rounded-lg">
            <Button variant={layoutMode === 'table' ? 'secondary' : 'ghost'} size="iconSm" onClick={() => setLayoutMode('table')} aria-label="Table View">
              <List className="h-4 w-4" />
            </Button>
            <Button variant={layoutMode === 'kanban' ? 'secondary' : 'ghost'} size="iconSm" onClick={() => setLayoutMode('kanban')} aria-label="Kanban View">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <CustomFieldCreate
            onSubmit={handleCustomFieldSubmit}
            fieldToEdit={fieldToEdit}
            onClose={() => setFieldToEdit(undefined)}
          />
          <TaskForm
            columns={taskColumns}
            task={taskToEdit}
            onSubmit={onTaskSubmit}
            onClose={() => {
              if (taskToEdit) {
                setTaskToEdit(undefined);
              }
            }}
          />
        </div>
      </div>
      {/* Conditional Rendering based on layoutMode */}
      {layoutMode === "table" ? (
        <TableView
          columns={taskColumns}
          tasks={todoList}
          onEditTask={setTaskToEdit}
          onDeleteTask={setTaskToDelete}
          onDeleteField={setFieldToDelete}
          onEditField={setFieldToEdit}
        />
      ) : (
        <KanbanView
          columns={taskColumns}
          tasks={todoList}
          onEditTask={setTaskToEdit}
          onDeleteTask={setTaskToDelete}
          onUpdateTask={handleUpdateTask} // Pass the update handler
        />
      )}
      <ConfirmationDialog
        show={taskToDelete !== null || fieldToDelete !== null}
        title={fieldToDelete ? `Delete ${fieldToDelete.title}` : "Delete Task"}
        description={`Are you sure you want to delete this ${
          fieldToDelete ? "field" : "task"
        }?`}
        onCancel={() =>
          fieldToDelete ? setFieldToDelete(null) : setTaskToDelete(null)
        }
        onConfirm={fieldToDelete ? handleFieldDelete : handleTaskDelete}
      />
    </>
  );
}
