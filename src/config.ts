import { TaskPriority } from "./types/types";


export const PRIORITY_COLORS: Record<TaskPriority, string> = {
	[TaskPriority.HIGH]: 'yellow.500',
	[TaskPriority.MEDIUM]: 'orange.500',
	[TaskPriority.LOW]: 'red.500',
	[TaskPriority.NONE]: 'transparent',
	
}
