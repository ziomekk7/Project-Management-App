import ProjectDetailListView from "./ProjectDetailListView";
import RootLayout from "../../../Roots/RootLayout";
import { useProjectDetailsPage } from "../../../hooks/useProjectDetailsPage";
import TaskDetails from "../SectionTable/TaskDetails";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectDetailBoardView from "./ProjectBoardViewComponents/ProjectDetailBoardView";
import {
  Box,
  Container,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { CustomScrollbar } from "../../../../config";

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
    // onChangeSectionLocation: projectDetailsPage.handleChangeSectionLocation,
    onChangeTaskLocation: projectDetailsPage.handleChangeTaskLocation,
    onDragOver: projectDetailsPage.handleDragOver,
    onDragStart: projectDetailsPage.handleDragStart,
    onDragEnd: projectDetailsPage.handleDragEnd,
    activeSection: projectDetailsPage.activeSection,
    activeTask: projectDetailsPage.activeTask,
    onCloseTaskDetails: projectDetailsPage.handleCloseTaskDetails,
  };
  if (!projectDetailsPage.project) {
    return;
  }
  return (
    <RootLayout>
      <Container maxW="container.xxl" h="100vh">
        <Grid templateRows="auto 1fr" h="100%">
          <GridItem top={0} position="sticky" zIndex={1}>
            <ProjectHeader
              onChangeView={projectDetailsPage.handleChangeView}
              onDeleteProject={projectDetailsPage.handleDeleteProject}
              project={projectDetailsPage.project}
            />
          </GridItem>
          <GridItem overflow="auto" css={CustomScrollbar}>
            {projectDetailsPage.selectedView === "list" ? (
              <Box h="100%" overflowY="auto" css={CustomScrollbar}>
                <ProjectDetailListView
                  {...commonProps}
                  onDuplicateTask={projectDetailsPage.handleCreateTask}
                  hiddenSections={projectDetailsPage.hiddenSections}
                  onDeleteTask={projectDetailsPage.handleDeleteTask}
                  onHideSectionId={projectDetailsPage.handleHideSection}
                />
              </Box>
            ) : (
              <ProjectDetailBoardView {...commonProps} />
            )}
          </GridItem>
        </Grid>

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
      </Container>
    </RootLayout>
  );
};

export default ProjectDetails;
