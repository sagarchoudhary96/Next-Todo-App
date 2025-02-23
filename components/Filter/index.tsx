import { TableColumn, TableColumnType } from "@/lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FilterProps = {
  value: string;
  onChange: (key: string, value: string) => void;
  column: TableColumn;
};

/**
 * Filter Component: Used by Table to render filter fields for columns
 * @param value - Filter Value
 * @param onChange - Filter Change Handler
 * @param column - Table Column
 * @returns JSX.Element
 */
const Filter = ({ column, value, onChange }: FilterProps) => {
  return (
    <div className="flex items-center gap-2">
      {column.type === TableColumnType.SELECT ? (
        <Select
          onValueChange={(value) => onChange(column.key, value)}
          value={value}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Filter ${column.title}`} />
          </SelectTrigger>
          <SelectContent>
            {column.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          placeholder={`Filter ${column.title}`}
          value={value || ""}
          onChange={(e) => onChange(column.key, e.target.value)}
        />
      )}

      {value && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(column.key, "")}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default Filter;
