import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TableColumn } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getValueLabelFromSelectColumn = (
  column: TableColumn,
  value?: string | number
) => {
  return column.options?.find((option) => option.value === value)?.label ?? "-";
};
