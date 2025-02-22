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
import tableColumns from "@/data/columns.json";
import initialTodos from "@/data/todo.json";
import { STATUS_LABEL_MAP } from "@/lib/constants";
import { TASK_STATUS } from "@/types/task";
import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export default function Home() {
  const [todoList] = useState(initialTodos);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(todoList.length / DEFAULT_PAGE_SIZE);
  const paginatedTodos = todoList.slice(
    (currentPage - 1) * DEFAULT_PAGE_SIZE,
    currentPage * DEFAULT_PAGE_SIZE
  );

  return (
    <>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 w-full overflow-auto">
          <Table className="border table-fixed">
            <TableHeader>
              <TableRow>
                {tableColumns.map(({ title, key }) => (
                  <TableHead className="border" key={key} scope="col">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-bold text-primary"
                    >
                      {title} <ArrowUpDownIcon className="w-4 h-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTodos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell>{todo.priority}</TableCell>
                  <TableCell>
                    {STATUS_LABEL_MAP[todo.status as TASK_STATUS]}
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
    </>
  );
}
