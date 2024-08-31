import ProjectDetailListView from "./ProjectDetailListView";
import RootLayout from "../../../Roots/RootLayout";
import { useProjectDetailsPage } from "../../../hooks/useProjectDetailsPage";
import TaskDetails from "../SectionTable/TaskDetails";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectDetailBoardView from "./ProjectBoardViewComponents/ProjectDetailBoardView";
import { Box, Container, Flex, useDisclosure } from "@chakra-ui/react";
import { CustomScrollbar } from "../../../../config";
import { useEffect } from "react";

const ProjectDetails = () => {
  const projectDetailsPage = useProjectDetailsPage();
  const deleteTaskModal = useDisclosure();

  useEffect(() => {
    document.title = projectDetailsPage?.project
      ? `${projectDetailsPage.project.name} - Management`
      : "Management";
    return () => {
      document.title = "Management";
    };
  }, [projectDetailsPage?.project]);
  if (!projectDetailsPage) return;
  const commonProps = {
    isCreatingSection: projectDetailsPage.isCreatingSection,
    project: projectDetailsPage.project,
    onOpenTaskDetails: projectDetailsPage.handleSetOpenTaskDetailLocation,
    isCreateSectionFormVisible: projectDetailsPage.isCreateSectionFormVisible,
    onCreateSection: projectDetailsPage.handleCreateSection,
    onDeleteSection: projectDetailsPage.handleDeleteSection,
    onCreateTask: projectDetailsPage.handleCreateTask,
    onOpenCreateSectionForm: projectDetailsPage.handleOpenCreateSectionForm,
    onCloseCreateSectionForm: projectDetailsPage.handleCloseCreateSectionForm,
    onEditTask: projectDetailsPage.handleEditTask,
    onChangeObjectLocation: projectDetailsPage.handleDragEnd,
    onChangeSectionLocation: projectDetailsPage.handleChangeSectionLocation,
    onChangeTaskLocation: projectDetailsPage.handleChangeTaskLocation,
    onDragOver: projectDetailsPage.handleDragOver,
    onDragStart: projectDetailsPage.handleDragStart,
    onDragEnd: projectDetailsPage.handleDragEnd,
    activeSection: projectDetailsPage.activeSection,
    activeTask: projectDetailsPage.activeTask,
    onCloseTaskDetails: projectDetailsPage.handleCloseTaskDetails,
  };

  if (!projectDetailsPage.project) {
    return (
      <RootLayout>
        <div>Loading...</div>
      </RootLayout>
    );
  } else if (projectDetailsPage.project || projectDetailsPage.openTask) {
    return (
      <RootLayout>
        <Container maxW="container.xl" height="100vh">
          <Flex direction="column" height="100%">
            <Box flex="none">
              <ProjectHeader
                onChangeView={projectDetailsPage.handleChangeView}
                onDeleteProject={projectDetailsPage.handleDeleteProject}
                project={projectDetailsPage.project}
              />
            </Box>

            <Box flex="1" overflow="auto" css={CustomScrollbar}>
              {projectDetailsPage.selectedView === "list" ? (
                <ProjectDetailListView
                  {...commonProps}
                  onDuplicateTask={projectDetailsPage.handleCreateTask}
                  hiddenSections={projectDetailsPage.hiddenSections}
                  onDeleteTask={projectDetailsPage.handleDeleteTask}
                  onHideSectionId={projectDetailsPage.handleHideSection}
                />
              ) : (
                <ProjectDetailBoardView {...commonProps} />
              )}
            </Box>
            {projectDetailsPage.openTask &&
              projectDetailsPage.openTaskDetailLocation && (
                <TaskDetails
                  onClose={projectDetailsPage.handleCloseTaskDetails}
                  isOpenMenu={projectDetailsPage.taskDetailsDrawer.isOpen}
                  taskDate={projectDetailsPage.openTask.date}
                  selectedDate={projectDetailsPage.selectedDate}
                  onDuplicateTask={projectDetailsPage.handleCreateTask}
                  onEditTask={projectDetailsPage.handleEditTask}
                  onOpenDeleteModal={deleteTaskModal.onOpen}
                  onDeleteTask={projectDetailsPage.handleDeleteTask}
                  selectedPriority={projectDetailsPage.openTask.priority}
                  task={projectDetailsPage.openTask}
                />
              )}
          </Flex>
        </Container>
      </RootLayout>
    );
  }
};

export default ProjectDetails;
