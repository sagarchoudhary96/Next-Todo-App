import { TASK_PRIORITY, TASK_STATUS } from "@/types/task";

export const STATUS_LABEL_MAP = {
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.COMPLETED]: "Completed",
  [TASK_STATUS.NOT_STARTED]: "Not Started",
};

export const TASK_PRIORITY_OPTIONS = [
  { label: "None", value: TASK_PRIORITY.NONE },
  { label: "Low", value: TASK_PRIORITY.LOW },
  { label: "Medium", value: TASK_PRIORITY.MEDIUM },
  { label: "High", value: TASK_PRIORITY.HIGH },
];

export const TASK_STATUS_OPTIONS = [
  { label: "Not Started", value: TASK_STATUS.NOT_STARTED },
  { label: "In Progress", value: TASK_STATUS.IN_PROGRESS },
  { label: "Completed", value: TASK_STATUS.COMPLETED },
];
