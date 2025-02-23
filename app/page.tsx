"use client";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import TableView from "@/components/TableView";
import TaskForm, { TaskFormSubmitFn } from "@/components/TaskForm";
import initialTodos from "@/data/todo.json";
import useTaskSchema from "@/hooks/useTaskSchema";
import { Task } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [todoList, setTodoList] = useState<Task[]>(initialTodos as Task[]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task>();
  const { taskColumns } = useTaskSchema();
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

  const handleDelete = () => {
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

  return (
    <>
      <div className="flex items-center w-full justify-end mb-4 gap-2">
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
      <TableView
        columns={taskColumns}
        tasks={todoList}
        onEditTask={setTaskToEdit}
        onDeleteTask={setTaskToDelete}
      />
      <ConfirmationDialog
        show={taskToDelete !== null}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
