"use client";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Filter from "@/components/Filter";
import TaskForm, { TaskFormSubmitFn } from "@/components/TaskForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import initialTodos from "@/data/todo.json";
import useTaskSchema from "@/hooks/useTaskSchema";
import { TableColumn, TableColumnType, Task } from "@/lib/types";
import { getValueLabelFromSelectColumn } from "@/lib/utils";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_PAGE_SIZE = 10;

export default function Home() {
  const [todoList, setTodoList] = useState<Task[]>(initialTodos as Task[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task>();
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const { taskColumns } = useTaskSchema();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredTodos = todoList.filter((task) =>
    Object.entries(filters).every(
      ([key, value]) =>
        !value || String(task[key]).toLowerCase().includes(value.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredTodos.length / DEFAULT_PAGE_SIZE);

  const paginatedTodos = filteredTodos.slice(
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

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const columnToSort = taskColumns.find((column) => column.key === key);
    if (!columnToSort) return;
    setSortConfig({ key, direction });
    setTodoList((prev) =>
      prev.sort((a, b) => {
        const aVal = a[key] || "";
        const bVal = b[key] || "";

        // for select column types sort by options
        if (columnToSort.type === TableColumnType.SELECT) {
          const columnOptionValues = (columnToSort.options || []).map(
            (option) => option.value
          );
          return direction === "asc"
            ? columnOptionValues.indexOf(aVal as string) -
                columnOptionValues.indexOf(bVal as string)
            : columnOptionValues.indexOf(bVal as string) -
                columnOptionValues.indexOf(aVal as string);
        } else {
          return direction === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
      })
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex items-center w-full justify-between mb-4 gap-2">
        <Input
          placeholder="Search tasks..."
          value={filters.title || ""}
          onChange={(e) => handleFilterChange("title", e.target.value)}
          className="w-full sm:w-1/3"
          aria-label="Search tasks"
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
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 w-full overflow-auto">
          <Table className="border sm:table-fixed">
            <TableHeader>
              <TableRow>
                {taskColumns.map((column) => (
                  <TableHead className="border" key={column.key} scope="col">
                    <div className="flex flex-col gap-1 pb-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 font-bold text-primary"
                        onClick={() => handleSort(column.key)}
                        aria-sort={
                          sortConfig.key === column.key
                            ? sortConfig.direction === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                      >
                        {column.title}
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUpNarrowWideIcon className="h-4 w-4" />
                          ) : (
                            <ArrowDownWideNarrowIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDownIcon className="w-4 h-4" />
                        )}
                      </Button>
                      {column.key !== "title" && (
                        <Filter
                          value={filters[column.key]}
                          onChange={handleFilterChange}
                          column={column}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="border w-38" scope="col">
                  <span className="font-bold text-primary">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!paginatedTodos.length && (
                <TableRow>
                  <TableCell
                    colSpan={taskColumns.length + 1}
                    className="text-center"
                  >
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
              {paginatedTodos.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer"
                  onClick={() => setTaskToEdit(task)}
                >
                  {taskColumns.map((column) => (
                    <TableCell
                      className="border"
                      key={`${task.id}-${column.key}`}
                    >
                      {column.type === TableColumnType.SELECT
                        ? getValueLabelFromSelectColumn(
                            column as TableColumn,
                            task[column.key as keyof Task]
                          )
                        : task[column.key as keyof Task]}
                    </TableCell>
                  ))}
                  <TableCell className="border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setTaskToEdit(task)}
                      >
                        <PenIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setTaskToDelete(task.id)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!!totalPages && (
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
        )}
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
