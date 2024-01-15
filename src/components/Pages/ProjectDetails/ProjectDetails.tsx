import ProjectDetailListView from "./ProjectDetailViews/ProjectDetailListView";
import RootLayout from "../../Roots/RootLayout";
import ProjectDetailBoardView from "./ProjectDetailViews/ProjectDetailBoardView";
import ProjectHeader from "./ProjectDetailViews/ProjectHeader/ProjectHeader";
import TaskDetails from "./ProjectDetailViews/SectionTable/TaskDetails";
import { useProjectDetailsPage } from "../../hooks/useProjectDetailsPage";

const ProjectDetails = () => {
  const projectDetailsPage = useProjectDetailsPage();
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
    onEditTask:projectDetailsPage.handleEditTask
  };

  if (!projectDetailsPage.project) {
    if (projectDetailsPage.project) {
      return (
        <RootLayout>
          <div>Loading....</div>
        </RootLayout>
      );
    }

    return (
      <RootLayout>
        <div>Loading....</div>
      </RootLayout>
    );
  }
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
            onDeleteTask={projectDetailsPage.handleDeleteTask}
            selectedPriority={projectDetailsPage.openTask.priority}
            task={projectDetailsPage.openTask}
          />
        )}
    </RootLayout>
  );
};

export default ProjectDetails;
