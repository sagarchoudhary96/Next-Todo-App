import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SORT_DIRECTION,
  TableColumn,
  TableColumnType,
  TableSortConfig,
  Task,
} from "@/lib/types";
import { getValueLabelFromSelectColumn } from "@/lib/utils";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import TablePagination from "./Pagination";

type TableViewProps = {
  columns: TableColumn[];
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
};

const DEFAULT_PAGE_SIZE = 10;

const TableView = ({
  columns,
  tasks,
  onEditTask,
  onDeleteTask,
}: TableViewProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<TableSortConfig>({
    key: "",
    direction: SORT_DIRECTION.ASC,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const handleSort = (key: string) => {
    let direction = SORT_DIRECTION.ASC;
    if (sortConfig.key === key && sortConfig.direction === SORT_DIRECTION.ASC) {
      direction = SORT_DIRECTION.DESC;
    }
    const columnToSort = columns.find((column) => column.key === key);
    if (!columnToSort) return;
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // reset pagination when filter changes
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const totalPages = Math.ceil(tasks.length / pagination.pageSize);

  const finalTasksRows = useMemo(() => {
    const finalTasks = [...tasks].filter((task) =>
      Object.entries(filters).every(
        ([key, value]) =>
          !value ||
          String(task[key]).toLowerCase().includes(value.toLowerCase())
      )
    );

    const columnToSort = columns.find(
      (column) => column.key === sortConfig.key
    );
    if (sortConfig.key && columnToSort) {
      finalTasks.sort((a, b) => {
        const aVal = a[columnToSort.key] || "";
        const bVal = b[columnToSort.key] || "";
        // for select column types sort by options
        if (columnToSort.type === TableColumnType.SELECT) {
          const columnOptionValues = (columnToSort.options || []).map(
            (option) => option.value
          );
          return sortConfig.direction === SORT_DIRECTION.ASC
            ? columnOptionValues.indexOf(aVal as string) -
                columnOptionValues.indexOf(bVal as string)
            : columnOptionValues.indexOf(bVal as string) -
                columnOptionValues.indexOf(aVal as string);
        } else {
          return sortConfig.direction === SORT_DIRECTION.ASC
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
      });
    }

    return finalTasks.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );
  }, [tasks, filters, columns, sortConfig, pagination]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 w-full overflow-auto">
        <Table className="border sm:table-fixed">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead className="border" key={column.key} scope="col">
                  <div className="flex flex-col gap-1 pb-2">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-bold text-primary"
                      onClick={() => handleSort(column.key)}
                      aria-sort={
                        sortConfig.key === column.key
                          ? sortConfig.direction === SORT_DIRECTION.ASC
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      {column.title}
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === SORT_DIRECTION.ASC ? (
                          <ArrowUpNarrowWideIcon className="h-4 w-4" />
                        ) : (
                          <ArrowDownWideNarrowIcon className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDownIcon className="w-4 h-4" />
                      )}
                    </Button>
                    <Filter
                      value={filters[column.key]}
                      onChange={handleFilterChange}
                      column={column}
                    />
                  </div>
                </TableHead>
              ))}
              <TableHead className="border w-38" scope="col">
                <span className="font-bold text-primary">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!finalTasksRows.length && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            )}
            {finalTasksRows.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer"
                onClick={() => onEditTask(task)}
              >
                {columns.map((column) => (
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
                      onClick={() => onEditTask(task)}
                    >
                      <PenIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteTask(task.id)}
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
        <TablePagination
          totalPages={totalPages}
          pagination={pagination}
          onUpdatePagination={setPagination}
        />
      )}
    </div>
  );
};

export default TableView;
