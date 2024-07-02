import ProjectDetailListView from "./ProjectDetailListView";
import RootLayout from "../../../Roots/RootLayout";
import { useProjectDetailsPage } from "../../../hooks/useProjectDetailsPage";
import TaskDetails from "../SectionTable/TaskDetails";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectDetailBoardView from "./ProjectBoardViewComponents/ProjectDetailBoardView";
import { useDisclosure } from "@chakra-ui/react";

const ProjectDetails = () => {
  const projectDetailsPage = useProjectDetailsPage();
  const deleteTaskModal = useDisclosure();
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
    onChangeTaskLocation: projectDetailsPage.handleChangeTaskLocation,
    onDragOver: projectDetailsPage.handleDragOver,
    onDragStart: projectDetailsPage.handleDragStart,
    onDragEnd: projectDetailsPage.handleDragEnd,
    activeSection: projectDetailsPage.activeSection,
    activeTask: projectDetailsPage.activeTask,
  };

  if (!projectDetailsPage.project) {
    return (
      <RootLayout>
        <div>No projects</div>
      </RootLayout>
    );
  } else if (projectDetailsPage.project || projectDetailsPage.openTask) {
    return (
      <RootLayout>
        <ProjectHeader
          onChangeView={projectDetailsPage.handleChangeView}
          onDeleteProject={projectDetailsPage.handleDeleteProject}
          project={projectDetailsPage.project}
        />
        
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
        {projectDetailsPage.openTask &&
          projectDetailsPage.openTaskDetailLocation && (
            <TaskDetails
              onClose={projectDetailsPage.taskDetailsDrawer.onClose}
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
      </RootLayout>
    );
  }
};

export default ProjectDetails;
