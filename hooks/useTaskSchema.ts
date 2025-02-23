import { TableColumn } from "@/lib/types";
import intialTaskColumns from "@/data/taskColumns.json";
import useLocalStorage from "./useLocalStorage";
import { useEffect, useState } from "react";
const useTaskSchema = () => {
  const [customColumns, setCustomColumns] = useLocalStorage<TableColumn[]>(
    "customColumns",
    []
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addNewColumn = (newColumn: TableColumn) => {
    // add column before the action column
    setCustomColumns((prev) => [...prev, newColumn]);
  };

  const removeColumn = (columnKey: string) => {
    setCustomColumns((prev) =>
      prev.filter((column) => column.key !== columnKey)
    );
  };

  const updateColumn = (columnKey: string, newColumn: Partial<TableColumn>) => {
    setCustomColumns((prev) =>
      prev.map((column) =>
        column.key === columnKey ? { ...column, ...newColumn } : column
      )
    );
  };

  return {
    taskColumns: isLoaded
      ? ([...intialTaskColumns, ...customColumns] as TableColumn[])
      : (intialTaskColumns as TableColumn[]),
    isLoaded,
    addNewColumn,
    removeColumn,
    updateColumn,
  };
};

export default useTaskSchema;
