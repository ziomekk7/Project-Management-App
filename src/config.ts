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

export const CustomScrollbar = {
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#353030",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#59597a",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#84749f",
  },
};

export const showMd = {
  base: "none",
  md: "block",
  lg: "block",
}
export const hideMd ={
  base: "block",
  md: "none",
  lg: "none",
}
