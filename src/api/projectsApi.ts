import { Project } from "../types/types";
import * as z from "zod";
import { Task, TaskPriority } from "../types/types";
import { exampleProject } from "../components/UI/Icons/ExpampleProject";

export type CreateProjectData = {
  newProject: string;
  projectId: string;
};

export type CreateProjectSectionData = {
  projectId: string;
  newSection: string;
  newSectionId: string;
};

export type CreateTaskData = {
  sectionId: string;
  task: Task;
};

export type DeleteTaskData = {
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
  task: Task;
};

export type ChangeSectionLocationData = {
  sectionId: string;
  destination: number;
  type: string;
};

export type ChangeTaskLocationData = {
  taskId: string;
  destinationSectionId: string;
  destinationIndex: number;
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
const FIRST_LOG = "firstLogg";

const checkFirstLogg = async () => {
  try {
    const isFirstLogg = localStorage.getItem(FIRST_LOG);
    if (!isFirstLogg) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify([exampleProject]));
      localStorage.setItem(FIRST_LOG, JSON.stringify(true));
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

checkFirstLogg();

export const saveProjects = async (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error(error);
  }
};

export const getProjects = async (): Promise<Project[]> => {
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

  project.sections.push({
    name: data.newSection,
    id: data.newSectionId,
    tasks: [],
  });
  await saveProjects(projects);
};

export const createTask = async (data: CreateTaskData) => {
  const projects = await getProjects();
  const project = projects.find((project) =>
    project.sections.find((section) => section.id == data.sectionId)
  );
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

export const getTaskById = async (taskId: string) => {
  const projects = await getProjects();
  const project = projects.find((project) =>
    project.sections.find((section) =>
      section.tasks.find((task) => taskId == task.id)
    )
  );
  if (!project) {
    return;
  }
  const section = project.sections.find((section) =>
    section.tasks.find((task) => taskId == task.id)
  );
  if (!section) {
    return;
  }

  return section.tasks.find((task) => taskId == task.id);
};

export const editTask = async (editedTask: Task) => {
  const projects = await getProjects();
  const project = projects.find((project) =>
    project.sections.find((section) =>
      section.tasks.find((task) => task.id === editedTask.id)
    )
  );
  if (!project) {
    return;
  }
  const section = project.sections.find((section) =>
    section.tasks.find((task) => task.id === editedTask.id)
  );
  if (!section) {
    return;
  }
  const taskIndex = section.tasks.findIndex(
    (task) => task.id === editedTask.id
  );
  section.tasks.splice(taskIndex, 1, editedTask);
  await saveProjects(projects);
};

export const deleteTask = async (taskId: string) => {
  const projects = await getProjects();
  const project = projects.find((project) =>
    project.sections.find((section) =>
      section.tasks.find((task) => task.id === taskId)
    )
  );
  if (!project) {
    return;
  }
  const section = project.sections.find((section) =>
    section.tasks.find((task) => task.id === taskId)
  );
  if (!section) {
    return;
  }
  const taskIndex = section.tasks.findIndex((task) => task.id === taskId);
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

export const changeLocation = async (data: Project) => {
  const projects = await getProjects();
  const editedProjectIndex = projects.findIndex(
    (project) => project.id === data.id
  );
  projects.splice(editedProjectIndex, 1, data);
  await saveProjects(projects);
};
