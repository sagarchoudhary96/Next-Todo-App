import { TableColumn } from "@/lib/types";
import intialTaskColumns from "@/data/taskColumns.json";
import useLocalStorage from "./useLocalStorage";
const useTaskSchema = () => {
  const [customColumns, setCustomColumns] = useLocalStorage<TableColumn[]>(
    "customColumns",
    []
  );

  const addNewColumn = (newColumn: TableColumn) => {
    // add column before the action column
    setCustomColumns((prev) => [...prev, newColumn]);
  };

  const removeColumn = (columnKey: string) => {
    setCustomColumns((prev) =>
      prev.filter((column) => column.key !== columnKey)
    );
  };

  return {
    taskColumns: [...intialTaskColumns, ...customColumns] as TableColumn[],
    addNewColumn,
    removeColumn,
  };
};

export default useTaskSchema;
