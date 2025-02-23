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
