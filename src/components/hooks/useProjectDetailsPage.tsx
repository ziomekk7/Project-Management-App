import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useEffect,
  useState,
  //  useReducer
} from "react";
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
  ChangeSectionLocation,
  changeSectionLocation,
} from "../../api/projectsApi";
import { queryKeys } from "../../queryKeys";
import { useDisclosure } from "@chakra-ui/react";
import { routes } from "../../routes";
import { v4 as uuidv4 } from "uuid";

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
    onMutate: async ({
      projectId,
      sourceIndex,
      destinationIndex,
    }: ChangeSectionLocation) => {
      const queryKey = queryKeys.projects.details({ projectId });
      await queryClient.cancelQueries({ queryKey });
      const previousProject = queryClient.getQueryData(queryKey);
      if (!projectQuery.data) {
        return;
      }
      const movedSection = projectQuery.data.sections[sourceIndex];
      const project = projectQuery.data;
      project.sections.splice(sourceIndex, 1),
        project.sections.splice(destinationIndex, 0, movedSection);
      if (!movedSection) {
        return;
      }
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

    const section = projectQuery.data?.sections.find((section) =>
      section.tasks.find((lookingTask) => lookingTask.id === task.id)
    );
    if (!section) {
      return;
    }
    createTaskMutation.mutate({
      sectionId: section.id,
      task: task,
    });
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
  const handleChangeSectionLocation = ({
    projectId,
    sourceIndex,
    destinationIndex,
  }: ChangeSectionLocation) => {
    changeSectionLocationMutation.mutate({
      projectId,
      sourceIndex,
      destinationIndex,
    });
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
    project: projectQuery.data,
    openTask: openTask,
  };
};
