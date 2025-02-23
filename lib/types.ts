export type Task = {
  id: number;
  title: string;
  priority?: string;
  status: string;
} & {
  [key: string]: string | number | undefined;
};

export type SelectOption = {
  label: string;
  value: string;
};

export enum TableColumnType {
  TEXT = "text",
  SELECT = "select",
  NUMBER = "number",
}

export type TableColumn = {
  key: string;
  title: string;
  type?: TableColumnType;
  required?: boolean;
  options?: { label: string; value: string }[];
};

export type TablePaginationState = {
  currentPage: number;
  pageSize: number;
};

export enum SORT_DIRECTION {
  ASC = "asc",
  DESC = "desc",
  NONE = "none",
}

export type TableSortConfig = {
  key: string;
  direction: SORT_DIRECTION;
};
