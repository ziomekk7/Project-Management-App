import { v4 as uuidv4 } from "uuid";
import { Project } from "../types/types";
import { delay } from "../utils/asyns";
import * as z from "zod";
import { Task, TaskPriority } from "../types/types";

export type CreateProjectData = {
  newProject: string;
  projectId: string;
};

export type CreateProjectSectionData = {
  projectId: string;
  newSection: string;
};

export type CreateTaskData = {
  projectId: string;
  sectionId: string;
  task: Task;
};

export type DeleteTaskData = {
  projectId: string;
  sectionId: string;
  taskId: string;
};

export type DeleteSectionData = {
  projectId: string;
  sectionId: string;
};

export type DeleteProjectData = {
  projectId: string;
};

export type EditTask = {
  projectId: string;
  sectionId: string;
  task: Task;
};

const projectsSchema = z.array(
  z.object({
    name: z.string(),
    id: z.string(),
    sections: z.array(
      z.object({
        name: z.string(),
        id: z.string(),
        tasks: z.array(
          z.object({
            name: z.string(),
            id: z.string(),
            date: z.coerce.date().nullable(),
            priority: z.nativeEnum(TaskPriority),
            description: z.string().nullable(),
          })
        ),
      })
    ),
  })
);

const PROJECTS_KEY = "projects";

const saveProjects = async (projects: Project[]) => {
  await delay(200);

  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error(error);
  }
};

export const getProjects = async (): Promise<Project[]> => {
  await delay(200);

  const rawProjects = localStorage.getItem(PROJECTS_KEY);
  if (!rawProjects) {
    return [];
  }

  try {
    const jsonValue = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "");
    const parsedValue = projectsSchema.parse(jsonValue);
    return parsedValue;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProjectById = async (projectId: string) => {
  await delay(1110);

  const projects = await getProjects();

  return projects.find((project) => project.id === projectId) || null;
};

export const createProject = async (data: CreateProjectData) => {
  const projects: Project[] = await getProjects();
  projects.push({ name: data.newProject, id: data.projectId, sections: [] });
  await saveProjects(projects);
};

export const createProjectSection = async (data: CreateProjectSectionData) => {
  const projects = await getProjects();
  const project = projects.find((project) => project.id === data.projectId);
  if (!project) {
    return;
  }

  project.sections.push({ name: data.newSection, id: uuidv4(), tasks: [] });
  await saveProjects(projects);
};

export const createTask = async (data: CreateTaskData) => {
  const projects = await getProjects();
  const project = projects.find((project) => project.id === data.projectId);
  if (!project) {
    return;
  }

  const section = project.sections.find(
    (section) => section.id === data.sectionId
  );
  if (!section) {
    return;
  }

  section.tasks.push(data.task);

  await saveProjects(projects);
};
// {
// 	name: data.newTask,
// 	id: data.taskId,
// 	date: null,
// 	priority: TaskPriority.NONE,
// 	description: null,
// }

export const editTask = async (data: EditTask) => {
  const projects = await getProjects();
  const project = projects.find((project) => project.id === data.projectId);
  if (!project) {
    return;
  }

  const section = project.sections.find(
    (section) => section.id === data.sectionId
  );
  if (!section) {
    return;
  }

  const taskIndex = section.tasks.findIndex((task) => task.id === data.task.id);
  const task = section.tasks[taskIndex];
  if (!task) {
    return;
  }

  section.tasks.splice(taskIndex, 1, data.task);
  await saveProjects(projects);
};

export const deleteTask = async (data: DeleteTaskData) => {
  const projects = await getProjects();
  const project = projects.find((project) => project.id === data.projectId);
  if (!project) {
    return;
  }

  const section = project.sections.find(
    (section) => section.id === data.sectionId
  );
  if (!section) {
    return;
  }

  const taskIndex = section.tasks.findIndex((task) => task.id === data.taskId);
  section.tasks.splice(taskIndex, 1);
  await saveProjects(projects);
};

export const deleteSection = async (data: DeleteSectionData) => {
  const projects = await getProjects();
  const project = projects.find((project) => project.id === data.projectId);
  if (!project) {
    return;
  }
  const sectionIndex = project.sections.findIndex(
    (section) => section.id === data.sectionId
  );
  project.sections.splice(sectionIndex, 1);
  await saveProjects(projects);
};

export const deleteProject = async (data: DeleteProjectData) => {
  const projects = await getProjects();
  const projectIndex = projects.findIndex(
    (project) => project.id === data.projectId
  );
  projects.splice(projectIndex, 1);
  await saveProjects(projects);
};
