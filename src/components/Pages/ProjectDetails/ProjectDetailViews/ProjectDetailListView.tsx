import { Button, Stack } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import SectionHeader from "./SectionTable/SectionHeader";
import SectionBody from "./SectionTable/SectionBody";
import ExampleTaskRow from "./SectionTable/ExampleTaskRow";
import ProjectHeader from "./ProjectHeader/ProjectHeader";

type ProjectDetailListViewProps = {
  project: Project;
  actuallyDeletingTasks: string[];
  isCreateTaskPending: boolean;
  isCreateSectionFormVisible: boolean;
  hiddenSections: string[];
  isAddingTask: boolean;
  onDeleteProject: (projectId: string) => void;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditTask: (task: Task, sectionId: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onCreateTask: (sectionId: string, task: Task) => void;
  onHideSectionId: (sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  actuallyDeletingSections: string[];
  duplicatedTask: (sectionId: string, task: Task) => void;
  isAddingSection: boolean;
};

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({
  project,
  isCreateTaskPending,
  isCreateSectionFormVisible,
  hiddenSections,
  actuallyDeletingTasks,
  onCreateSection,
  onDeleteSection,
  onDeleteTask,
  onCreateTask,
  onEditTask,
  onHideSectionId,
  onOpenCreateSectionForm,
  onCloseCreateSectionForm,
  isAddingTask,
  actuallyDeletingSections,
  duplicatedTask,
  isAddingSection,
  onDeleteProject,
}) => {
  return (
    <Stack w="100%">
      <ProjectHeader
        project={project}
        onDeleteProject={(projectId) => onDeleteProject(projectId)}
      />
      <ExampleTaskRow />
      {project.sections.map((section) => (
        <div key={section.id}>
          <SectionHeader
            actuallyDeletingSections={actuallyDeletingSections}
            section={section}
            onDeleteSection={() => onDeleteSection(section.id)}
            onToggleHideSection={() => onHideSectionId(section.id)}
            hiddenSections={hiddenSections}
          />
          <SectionBody
            duplicatedTask={(task) => duplicatedTask(section.id, task)}
            section={section}
            onDeleteTask={(taskId) => onDeleteTask(section.id, taskId)}
            actuallyDeletingTasks={actuallyDeletingTasks}
            onEditTask={(task) => onEditTask(task, section.id)}
            onCreateTask={(task) => {
              onCreateTask(section.id, task);
            }}
            isCreateTaskPending={isCreateTaskPending}
            isAddingTask={isAddingTask}
            hiddenSections={hiddenSections}
          />
        </div>
      ))}
      <Stack p={4} w="md">
        {isCreateSectionFormVisible ? (
          <CreateSectionForm
            isAddingSection={isAddingSection}
            onClose={() => onCloseCreateSectionForm()}
            onAddSection={(name) => onCreateSection(name)}
          />
        ) : !isAddingSection ? (
          <Button
            variant="outline"
            w="120px"
            onClick={() => onOpenCreateSectionForm()}
          >
            Add Section
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default ProjectDetailListView;
