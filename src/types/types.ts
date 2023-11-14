export type Task = { name: string; id: string; date: Date | null }

export type Section = { name: string; tasks: Task[]; id: string }

export type Project = { name: string; sections: Section[]; id: string }
