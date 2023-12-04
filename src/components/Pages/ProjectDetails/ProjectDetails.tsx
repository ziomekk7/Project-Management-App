import { useNavigate, useParams } from "react-router-dom";
import {
  getProjectById,
  deleteProject,
  DeleteProjectData,
  createProjectSection,
  createTask,
  deleteSection,
  deleteTask,
  editTask,
} from "../../../api/projectsApi";
import ProjectDetailListView from "./ProjectDetailViews/ProjectDetailListView";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { routes } from "../../../routes";
import { queryKeys } from "../../../queryKeys";
import { Task } from "../../../types/types";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import RootLayout from "../../Roots/RootLayout";

const ProjectDetails = () => {
  const [isCreateSectionFormVisible, setIsCreateSectionFormVisible] =
    useState(false);
  const [actuallyDeletingTasks, setActuallyDeletingTasks] = useState<string[]>(
    []
  );
  const [actuallyDeletingSections, setActuallyDeletingSections] = useState<
    string[]
  >([]);
  const [hiddenSections, setHiddenSection] = useState<string[]>([]);
  const [creatingTaskLocalization, setCreatingTaskLocalization] = useState<{
    sectionId: string;
    taskId: string;
  } | null>(null);
  const [isCreatingSection, setIsCreatingSection] = useState(false);

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
    return () => {
      if (!projectQuery.data) {
        return;
      }
      if (!creatingTaskLocalization) {
        return;
      }
      const section = projectQuery.data.sections.find(
        (section) => creatingTaskLocalization.sectionId === section.id
      );
      if (!section) {
        return;
      }

      if (
        !section.tasks.find(
          (task) => creatingTaskLocalization.taskId === task.id
        )
      ) {
        setCreatingTaskLocalization(null);
      }
    };
  }, [projectQuery.data, creatingTaskLocalization]);

  const deleteProjectMutation = useMutation({
    mutationFn: (data: DeleteProjectData) => deleteProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const createProjectSectionMutation = useMutation({
    mutationFn: createProjectSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      setIsCreateSectionFormVisible(false);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
    onError: (_, variables) => {
      setActuallyDeletingSections((prevActuallyDeletingSections) =>
        prevActuallyDeletingSections.filter(
          (sectionId) => sectionId !== variables.sectionId
        )
      );
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
    onError: (_, variables) => {
      setActuallyDeletingTasks((prevActuallyDeletingTasks) =>
        prevActuallyDeletingTasks.filter(
          (taskId) => taskId !== variables.taskId
        )
      );
    },
  });

  const editTaskMutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate({ projectId: projectId });
    navigate(routes.home());
  };

  const handleCreateSection = (newSection: string) => {
    setIsCreatingSection(true);
    createProjectSectionMutation.mutate({
      newSection,
      projectId,
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    setActuallyDeletingSections((prevActuallyDeletingSections) => [
      ...prevActuallyDeletingSections,
      sectionId,
    ]);
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

  const handleCreateTask = (sectionId: string, task: Task) => {
    const newTaskId = uuidv4();
    setCreatingTaskLocalization({ sectionId: sectionId, taskId: newTaskId });
    createTaskMutation.mutate({
      projectId,
      sectionId: sectionId,
      task: task,
    });
  };

  const handleDeleteTask = (sectionId: string, taskId: string) => {
    setActuallyDeletingTasks((prevActuallyDeletingTasks) => [
      ...prevActuallyDeletingTasks,
      taskId,
    ]);
    deleteTaskMutation.mutate({
      projectId,
      sectionId: sectionId,
      taskId: taskId,
    });
  };

  const handleEditTask = (task: Task, sectionId: string) => {
    editTaskMutation.mutate({
      projectId,
      sectionId: sectionId,
      task: task,
    });
  };

  if (!projectQuery.data) {
    if (projectQuery.isLoading) {
      return (
        <RootLayout>
          <div>Loading....</div>
        </RootLayout>
      );
    }

    return (
      <RootLayout>
        <div>Project not found</div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <ProjectDetailListView
        onDeleteProject={handleDeleteProject}
        isCreatingSection={isCreatingSection}
        onDuplicateTask={handleCreateTask}
        actuallyDeletingSections={actuallyDeletingSections}
        project={projectQuery.data}
        isCreateTaskPending={createTaskMutation.isPending}
        hiddenSections={hiddenSections}
        isCreateSectionFormVisible={isCreateSectionFormVisible}
        actuallyDeletingTasks={actuallyDeletingTasks}
        isCreatingTask={!creatingTaskLocalization ? false : true}
        onCreateSection={handleCreateSection}
        onDeleteSection={handleDeleteSection}
        onDeleteTask={handleDeleteTask}
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        onHideSectionId={handleHideSection}
        onOpenCreateSectionForm={() => setIsCreateSectionFormVisible(true)}
        onCloseCreateSectionForm={() => setIsCreateSectionFormVisible(false)}
      />
    </RootLayout>
  );
};

export default ProjectDetails;
