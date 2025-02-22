export enum TASK_STATUS {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  NOT_STARTED = "not_started",
}

export enum TASK_PRIORITY {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export type Task = {
  id: number;
  title: string;
  priority?: TASK_PRIORITY;
  status: TASK_STATUS;
};
