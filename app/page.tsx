"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TaskForm, { TaskFormSubmitFn } from "@/components/TaskForm";
import tableColumns from "@/data/columns.json";
import initialTodos from "@/data/todo.json";
import { STATUS_LABEL_MAP } from "@/lib/constants";
import { Task, TASK_STATUS } from "@/types/task";
import { ArrowUpDownIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

export default function Home() {
  const [todoList, setTodoList] = useState<Task[]>(initialTodos as Task[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task>();

  const totalPages = Math.ceil(todoList.length / DEFAULT_PAGE_SIZE);
  const paginatedTodos = todoList.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE
  );

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
          id: todoList.length + 1,
          ...taskValues,
        },
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
      <div className="flex items-center w-full justify-end mb-4">
        <TaskForm
          task={taskToEdit}
          onSubmit={onTaskSubmit}
          onClose={() => {
            if (taskToEdit) {
              setTaskToEdit(undefined);
            }
          }}
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 w-full overflow-auto">
          <Table className="border table-fixed">
            <TableHeader>
              <TableRow>
                {tableColumns.map(({ title, key }) => (
                  <TableHead className="border" key={key} scope="col">
                    {key === "actions" ? (
                      <span className="font-bold text-primary">{title}</span>
                    ) : (
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 font-bold text-primary"
                      >
                        {title} <ArrowUpDownIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTodos.map((todo) => (
                <TableRow
                  key={todo.id}
                  className="cursor-pointer"
                  onClick={() => setTaskToEdit(todo)}
                >
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell>{todo.priority}</TableCell>
                  <TableCell>
                    {STATUS_LABEL_MAP[todo.status as TASK_STATUS]}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaskToDelete(todo.id);
                      }}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex w-full justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-md font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
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
