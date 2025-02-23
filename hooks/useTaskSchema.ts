import { TableColumn } from "@/lib/types";
import intialTaskColumns from "@/data/taskColumns.json";
import useLocalStorage from "./useLocalStorage";
import { useEffect, useState } from "react";
const useTaskSchema = () => {
  // We use local storage to store custom columns
  const [customColumns, setCustomColumns] = useLocalStorage<TableColumn[]>(
    "customColumns",
    []
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // We set isLoaded to true after the first render to prevent hydration mismatch
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const addNewColumn = (newColumn: TableColumn) => {
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
