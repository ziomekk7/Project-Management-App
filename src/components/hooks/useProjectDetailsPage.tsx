import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Project, Section, Task } from "../../types/types";
import {
  getProjectById,
  getTaskById,
  deleteProject,
  createProjectSection,
  createTask,
  deleteSection,
  deleteTask,
  editTask,
  CreateTaskData,
  CreateProjectSectionData,
  DeleteSectionData,
  ChangeTaskLocationData,
  changeLocation,
} from "../../api/projectsApi";
import { queryKeys } from "../../queryKeys";
import { useDisclosure } from "@chakra-ui/react";
import { routes } from "../../routes";
import { v4 as uuidv4 } from "uuid";
import { DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { throttle } from "lodash";

export const useProjectDetailsPage = () => {
  const [hiddenSections, setHiddenSection] = useState<string[]>([]);
  const [selectedView, setSelectedView] = useState("list");
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateSectionFormVisible, setIsCreateSectionFormVisible] =
    useState(false);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [openTaskDetailLocation, setOpenTaskDetailLocation] = useState<null | {
    taskId: string;
    sectionId: string;
  }>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dragOverProject, setDragOverProject] = useState<Project | null>(null);

  const taskDetailsDrawer = useDisclosure();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId || "";
  const queryClient = useQueryClient();
  const projectQuery = useQuery({
    queryKey: queryKeys.projects.details({ projectId }),
    queryFn: () => getProjectById(projectId),
  });

  useEffect(() => {
    setIsCreatingSection(false);
  }, [projectQuery.data]);

  useEffect(() => {
    const section = projectQuery.data?.sections.find(
      (section) => section.id === openTaskDetailLocation?.sectionId
    );
    const openTask = section?.tasks.find(
      (task) => task.id === openTaskDetailLocation?.taskId
    );
    if (!openTask) {
      return;
    }
    setOpenTask(openTask);
    setSelectedDate(openTask.date);
  }, [projectQuery.data, openTaskDetailLocation]);

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      navigate(routes.home());
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const createProjectSectionMutation = useMutation({
    mutationFn: createProjectSection,
    onMutate: async (data: CreateProjectSectionData) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (previousProject: Project): Project => ({
          ...previousProject,
          sections: [
            ...previousProject.sections,
            { name: data.newSection, id: data.newSectionId, tasks: [] },
          ],
        })
      );
      setIsCreateSectionFormVisible(false);
      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onMutate: async ({ sectionId, task }: CreateTaskData) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: prevProject.sections.map((section) =>
            section.id !== sectionId
              ? { ...section }
              : { ...section, tasks: [...section.tasks, task] }
          ),
        })
      );
      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSection,
    onMutate: async (data: DeleteSectionData) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: prevProject.sections.filter(
            (section) => section.id !== data.sectionId
          ),
        })
      );
      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId: string) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: prevProject.sections.map((section) => ({
            ...section,
            tasks: section.tasks.filter((task) => task.id !== taskId),
          })),
        })
      );
      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: editTask,
    onMutate: async (editedTask) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: prevProject.sections.map((section) => ({
            ...section,
            tasks: section.tasks.map((task) =>
              task.id == editedTask.id ? { ...editedTask } : { ...task }
            ),
          })),
        })
      );
      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const handleDndMutation = useMutation({
    mutationFn: changeLocation,
    onMutate: async (data: Project) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      if (!projectQuery.data) {
        return;
      }

      const previousProject: Project = {
        ...projectQuery.data,
        sections: projectQuery.data.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((task) => ({ ...task })),
        })),
      };
      queryClient.setQueryData(queryKey, (): Project => data);

      return { previousProject };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        queryKeys.projects.details({ projectId }),
        context?.previousProject
      );
    },
    onSettled: () => {
      setDragOverProject(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  if (!projectQuery) {
    return;
  }

  const handleCreateSection = (newSection: string) => {
    setIsCreatingSection(true);
    const newSectionId = uuidv4();
    createProjectSectionMutation.mutate({
      newSection,
      projectId,
      newSectionId,
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSectionMutation.mutate({
      projectId,
      sectionId: sectionId,
    });
  };

  const handleHideSection = (hidedSectionId: string) => {
    if (!hiddenSections.find((sectionId) => sectionId === hidedSectionId)) {
      setHiddenSection((prevHiddenSections) => [
        ...prevHiddenSections,
        hidedSectionId,
      ]);
    } else {
      setHiddenSection(
        hiddenSections.filter((sectionId) => sectionId !== hidedSectionId)
      );
    }
  };

  const handleCreateTask = (task: Task, sectionId?: string) => {
    if (sectionId) {
      createTaskMutation.mutate({
        sectionId: sectionId,
        task: task,
      });
    }
    if (openTask) {
      if (!projectQuery.data) {
        return;
      }
      const section = projectQuery.data.sections.find((section) =>
        section.tasks.find((lookingTask) => lookingTask.id === openTask.id)
      );
      if (!section) {
        return;
      }
      createTaskMutation.mutate({
        sectionId: section.id,
        task: task,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleEditTask = (task: Task) => {
    editTaskMutation.mutate(task);
  };

  const handleEditDescription = async (
    description: string | null,
    taskId: string
  ) => {
    const editedTask = await getTaskById(taskId);
    if (!editedTask) {
      return;
    }
    handleEditTask({ ...editedTask, description: description });
  };

  const handleChangeView = (view: string) => {
    setSelectedView(view);
  };
  const handleCloseTaskDetails = () => {
    setOpenTaskDetailLocation(null);
    taskDetailsDrawer.onClose();
  };
  const handleSetOpenTaskDetailLocation = (
    taskId: string,
    sectionId: string
  ) => {
    setOpenTaskDetailLocation({
      taskId: taskId,
      sectionId: sectionId,
    });
    taskDetailsDrawer.onOpen();
  };
  const handleOpenCreateSectionForm = () => {
    setIsCreateSectionFormVisible(true);
  };
  const handleCloseCreateSectionForm = () => {
    setIsCreateSectionFormVisible(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!projectQuery.data) return;
    setDragOverProject(dragOverProject || projectQuery.data);
    const { active } = event;
    if (active.data.current?.type === "section") {
      setActiveSection(active.data.current?.section);
    }
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current?.task);
    }
  };

  const handleDragEnd = async () => {
    setActiveTask(null);
    setActiveSection(null);
    if (!dragOverProject) return;
    handleDndMutation.mutate(dragOverProject);
  };

  const handleDragOver = throttle((event: DragOverEvent) => {
    const { over, active } = event;
    const project = projectQuery.data;
    if (!over || !project) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "task" && overType === "task") {
      const activeSectionIndex = project.sections.findIndex((section) =>
        section.tasks.some((task) => task.id === activeId)
      );
      const overSectionIndex = project.sections.findIndex((section) =>
        section.tasks.some((task) => task.id === overId)
      );

      if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
        const activeSection = project.sections[activeSectionIndex];
        const overSection = project.sections[overSectionIndex];

        if (activeSectionIndex === overSectionIndex) {
          const activeTaskIndex = activeSection.tasks.findIndex(
            (task) => task.id === activeId
          );
          const overTaskIndex = overSection.tasks.findIndex(
            (task) => task.id === overId
          );

          const updatedTasks = arrayMove(
            activeSection.tasks,
            activeTaskIndex,
            overTaskIndex
          );
          const editedSection = { ...activeSection, tasks: updatedTasks };
          const updatedSections = [...project.sections];
          updatedSections[activeSectionIndex] = editedSection;

          setDragOverProject({ ...project, sections: updatedSections });
        } else {
          const updatedActiveSectionTasks = [...activeSection.tasks];
          const [movedTask] = updatedActiveSectionTasks.splice(
            activeSection.tasks.findIndex((task) => task.id === activeId),
            1
          );
          if (overSectionIndex < activeSectionIndex) {
            const updatedOverSectionTasks = [...overSection.tasks];
            if (!activeTask) return;
            updatedOverSectionTasks.push(activeTask);

            const updatedSections = [...project.sections];
            updatedSections[activeSectionIndex] = {
              ...activeSection,
              tasks: updatedActiveSectionTasks,
            };
            updatedSections[overSectionIndex] = {
              ...overSection,
              tasks: updatedOverSectionTasks,
            };

            setDragOverProject({ ...project, sections: updatedSections });
            handleDndMutation.mutate({ ...project, sections: updatedSections });
          }
          const updatedOverSectionTasks = [
            ...overSection.tasks.slice(
              0,
              overSection.tasks.findIndex((task) => task.id === overId)
            ),
            movedTask,
            ...overSection.tasks.slice(
              overSection.tasks.findIndex((task) => task.id === overId)
            ),
          ];

          const updatedSections = [...project.sections];
          updatedSections[activeSectionIndex] = {
            ...activeSection,
            tasks: updatedActiveSectionTasks,
          };
          updatedSections[overSectionIndex] = {
            ...overSection,
            tasks: updatedOverSectionTasks,
          };

          setDragOverProject({ ...project, sections: updatedSections });
        }
      }
    } else if (activeType === "task" && overType === "section") {
      const activeSectionIndex = project.sections.findIndex((section) =>
        section.tasks.some((task) => task.id === activeId)
      );
      const destinationSectionIndex = project.sections.findIndex(
        (section) => section.id === overId
      );

      if (activeSectionIndex !== -1 && destinationSectionIndex !== -1) {
        const activeSection = project.sections[activeSectionIndex];
        const destinationSection = project.sections[destinationSectionIndex];

        const updatedActiveSectionTasks = [...activeSection.tasks];
        const [movedTask] = updatedActiveSectionTasks.splice(
          activeSection.tasks.findIndex((task) => task.id === activeId),
          1
        );

        const updatedDestinationTasks = [
          ...destinationSection.tasks,
          movedTask,
        ];

        const updatedSections = [...project.sections];
        updatedSections[activeSectionIndex] = {
          ...activeSection,
          tasks: updatedActiveSectionTasks,
        };
        updatedSections[destinationSectionIndex] = {
          ...destinationSection,
          tasks: updatedDestinationTasks,
        };

        setDragOverProject({ ...project, sections: updatedSections });
      }
    } else if (activeType === "section" && overType === "section") {
      const activeSectionIndex = project.sections.findIndex(
        (section) => section.id === activeId
      );
      const overSectionIndex = project.sections.findIndex(
        (section) => section.id === overId
      );

      if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
        const updatedSections = arrayMove(
          project.sections,
          activeSectionIndex,
          overSectionIndex
        );
        setDragOverProject({ ...project, sections: updatedSections });
      }
    }
  }, 100);

  const handleChangeTaskLocation = (data: ChangeTaskLocationData) => {
    if (!projectQuery.data) return;
    const project = { ...projectQuery.data };
    const sourceSectionIndex = project.sections.findIndex((section) =>
      section.tasks.find((task) => task.id === data.taskId)
    );
    const destinationSectionIndex = project.sections.findIndex(
      (section) => section.id === data.destinationSectionId
    );
    const movedTaskIndex = project.sections[sourceSectionIndex].tasks.findIndex(
      (task) => task.id === data.taskId
    );
    const movedTask =
      project.sections[sourceSectionIndex].tasks[movedTaskIndex];
    project.sections[sourceSectionIndex].tasks.splice(movedTaskIndex, 1);
    project.sections[destinationSectionIndex].tasks.splice(0, 0, movedTask);
    handleDndMutation.mutate(project);
  };

  return {
    handleDeleteTask,
    handleCreateTask,
    handleHideSection,
    handleDeleteSection,
    handleCreateSection,
    handleDeleteProject: (projectId: string) =>
      deleteProjectMutation.mutate({ projectId }),
    handleChangeView,
    handleSetOpenTaskDetailLocation,
    handleCloseTaskDetails,
    handleEditTask: (task: Task) => editTaskMutation.mutate(task),
    handleOpenCreateSectionForm,
    handleCloseCreateSectionForm,
    handleEditDescription,
    selectedView: selectedView,
    selectedDate: selectedDate,
    isCreateSectionFormVisible: isCreateSectionFormVisible,
    isCreatingSection: isCreatingSection,
    isCreatingTask: createTaskMutation.isPending,
    taskDetailsDrawer: taskDetailsDrawer,
    hiddenSections: hiddenSections,
    createTaskMutation: createTaskMutation.isPending,
    openTaskDetailLocation: openTaskDetailLocation,
    project: dragOverProject || projectQuery.data,
    openTask: openTask,
    handleChangeTaskLocation,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    activeSection,
    activeTask,
  };
};
