import { TaskPriority } from "./types/types";

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: " red.500",
  [TaskPriority.MEDIUM]: "orange.500",
  [TaskPriority.LOW]: "yellow.500",
  [TaskPriority.NONE]: "transparent",
};

export const PRIORITY_COLORS_HOVER: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "red.600",
  [TaskPriority.MEDIUM]: "orange.600",
  [TaskPriority.LOW]: "yellow.600",
  [TaskPriority.NONE]: "gray.600",
};
