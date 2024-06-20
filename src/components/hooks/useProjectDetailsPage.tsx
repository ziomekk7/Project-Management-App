import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Project, Task } from "../../types/types";
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
  changeSectionLocation,
  changeTaskLocation,
  ChangeSectionLocationData,
  ChangeTaskLocationData,
} from "../../api/projectsApi";
import { queryKeys } from "../../queryKeys";
import { useDisclosure } from "@chakra-ui/react";
import { routes } from "../../routes";
import { v4 as uuidv4 } from "uuid";
import { DragEndEvent } from "@dnd-kit/core";

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
      console.log(previousProject, "previousProject");
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

  const changeSectionLocationMutation = useMutation({
    mutationFn: changeSectionLocation,
    onMutate: async (data: ChangeSectionLocationData) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });

      if (!projectQuery.data) {
        return;
      }
      const previousProject: Project = {
        ...projectQuery.data,
        sections: projectQuery.data.sections.map((section) => ({ ...section })),
      };
      const movedSectionIndex = previousProject.sections.findIndex(
        (section) => section.id === data.sectionId
      );
      const movedSection = previousProject.sections[movedSectionIndex];
      const editedSections = projectQuery.data.sections;
      editedSections.splice(movedSectionIndex, 1);
      editedSections.splice(data.destination, 0, movedSection);
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: editedSections,
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

  const changeTaskLocationMutation = useMutation({
    mutationFn: changeTaskLocation,
    onMutate: async (data: ChangeTaskLocationData) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });

      const previousProject = queryClient.getQueryData(queryKey);
      if (!projectQuery.data) {
        return;
      }
      const project: Project = {
        ...projectQuery.data,
        sections: projectQuery.data.sections.map((section) => ({
          ...section,
          tasks: section.tasks.map((task) => ({ ...task })),
        })),
      };
      const sectionIndex = project.sections.findIndex((section) =>
        section.tasks.find((task) => task.id === data.taskId)
      );
      const sectionDestinationIndex = project.sections.findIndex(
        (section) => section.id === data.destinationSectionId
      );
      const taskIndex = project.sections[sectionIndex].tasks.findIndex(
        (task) => task.id === data.taskId
      );
      const task = project.sections[sectionIndex].tasks[taskIndex];
      project.sections[sectionIndex].tasks.splice(taskIndex, 1);
      project.sections[sectionDestinationIndex].tasks.splice(
        data.destinationIndex,
        0,
        task
      );
      queryClient.setQueryData(
        queryKey,
        (prevProject: Project): Project => ({
          ...prevProject,
          sections: project.sections,
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

  if (!projectQuery) {
    return;
  }

  const handleCreateSection = (newSection: string) => {
    console.log("handleCreateSectionStart");
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
    console.log("handleCreateTask");
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

  const handleDragEnd = (event: DragEndEvent) => {
    const project = projectQuery.data;
    const source = event.active;
    const destination = event.over;

    if (
      !project ||
      !source.data.current ||
      !destination ||
      !destination.data.current
    ) {
      return;
    }

    if (source.id === destination.id) {
      return;
    }

    const sourceType = source.data.current.type;
    const destinationType = destination.data.current.type;
    const findDestinationSectionIdexByTaskId = (destinationTaskId: string) => {
      const destinationSectionIndex = project.sections.findIndex((section) =>
        section.tasks.find((task) => task.id === destinationTaskId)
      );
      return destinationSectionIndex;
    };
    const findDestinationSectionIndexBySectionId = (
      destinationSectionId: string
    ) => {
      const destinationSectionIndex = project.sections.findIndex(
        (section) => destinationSectionId === section.id
      );
      return destinationSectionIndex;
    };

    if (sourceType === "section") {
      const sourceSectionId = source.id;
      if (destinationType === "task") {
        const data = {
          sectionId: sourceSectionId.toLocaleString(),
          destination: findDestinationSectionIdexByTaskId(
            destination.id.toLocaleString()
          ),
          type: "section",
        };
        changeSectionLocationMutation.mutate(data);
      } else if (destinationType === "section") {
        const destinationSectionIndex = findDestinationSectionIndexBySectionId(
          destination.id.toLocaleString()
        );
        const data = {
          sectionId: sourceSectionId.toLocaleString(),
          destination: destinationSectionIndex,
          type: "section",
        };
        changeSectionLocationMutation.mutate(data);
      }
    } else if (sourceType === "task") {
      const sourceTaskId = source.id.toLocaleString();
      if (destinationType == "section") {
        const destinationSectionIndex = findDestinationSectionIndexBySectionId(
          destination.id.toLocaleString()
        );
        const destinationSectionId =
          project.sections[destinationSectionIndex].id;
        const data = {
          taskId: sourceTaskId,
          destinationSectionId: destinationSectionId,
          destinationIndex: 0,
        };

        changeTaskLocationMutation.mutate(data);
      } else if (destinationType == "task") {
        const destinationTaskId = destination.id;
        const destinationSectionIndex = findDestinationSectionIdexByTaskId(
          destination.id.toLocaleString()
        );
        const destinationTaskIndex = project.sections[
          destinationSectionIndex
        ].tasks.findIndex((task) => task.id === destinationTaskId);

        const destinationSection = project.sections[destinationSectionIndex];
        const data = {
          taskId: sourceTaskId,
          destinationSectionId: destinationSection.id,
          destinationIndex: destinationTaskIndex,
        };
        changeTaskLocationMutation.mutate(data);
      }
    }
  };

  const handleChangeSectionLocation = (data: ChangeSectionLocationData) => {
    changeSectionLocationMutation.mutate(data);
  };
  const handleChangeTaskLocation = (data: ChangeTaskLocationData) => {
    changeTaskLocationMutation.mutate(data);
  };
  const checkProject = () => {
    if (projectQuery.data == undefined) {
      return;
    }
    if (projectQuery.data) {
      return projectQuery.data;
    }
    return;
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
    handleEditTask: (task: Task) => editTaskMutation.mutate(task),
    handleOpenCreateSectionForm,
    handleCloseCreateSectionForm,
    handleEditDescription,
    handleChangeSectionLocation,
    selectedView: selectedView,
    selectedDate: selectedDate,
    isCreateSectionFormVisible: isCreateSectionFormVisible,
    isCreatingSection: isCreatingSection,
    isCreatingTask: createTaskMutation.isPending,
    taskDetailsDrawer: taskDetailsDrawer,
    hiddenSections: hiddenSections,
    createTaskMutation: createTaskMutation.isPending,
    openTaskDetailLocation: openTaskDetailLocation,
    project: checkProject(),
    openTask: openTask,
    handleChangeTaskLocation,
    handleDragEnd,
  };
};
