export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  NONE = "none",
}

export type Task = {
  name: string;
  id: string;
  sectionId:string
  date: Date | null;
  priority: TaskPriority;
  description: string | null;
};

export type Section = { name: string; tasks: Task[]; id: string };

export type Project = { name: string; sections: Section[]; id: string };
