import { Box, Button, Stack } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import SectionHeader from "./SectionTable/SectionHeader";
import SectionBody from "./SectionTable/SectionBody";
import ExampleTaskRow from "./SectionTable/ExampleTaskRow";
type ProjectDetailListViewProps = {
  project: Project;
  actuallyDeletingTasks: string[];
  isCreateTaskPending: boolean;
  isCreateSectionFormVisible: boolean;
  hiddenSections: string[];
  isCreatingTask: boolean;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditTask: (task: Task, sectionId: string) => void;
  onDeleteTask: (sectionId: string, taskId: string) => void;
  onCreateTask: (sectionId: string, task: Task) => void;
  onHideSectionId: (sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  actuallyDeletingSections: string[];
  onDuplicateTask: (sectionId: string, task: Task) => void;
  isCreatingSection: boolean;
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
  isCreatingTask,
  actuallyDeletingSections,
  onDuplicateTask,
  isCreatingSection,
}) => {
  return (
      <Stack  overflow="auto" h="85%" >
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

            {!hiddenSections.some((sectionId) => sectionId === section.id) && (
              <SectionBody
                onDuplicateTask={(task) => onDuplicateTask(section.id, task)}
                section={section}
                onDeleteTask={(taskId) => onDeleteTask(section.id, taskId)}
                actuallyDeletingTasks={actuallyDeletingTasks}
                onEditTask={(task) => onEditTask(task, section.id)}
                onCreateTask={(task) => {
                  onCreateTask(section.id, task);
                }}
                isCreateTaskPending={isCreateTaskPending}
                isCreatingTask={isCreatingTask}
              />
            )}
          </div>
        ))}
        <Stack p={4} w="md">
          {isCreateSectionFormVisible ? (
            <CreateSectionForm
              isCreatingSection={isCreatingSection}
              onClose={() => onCloseCreateSectionForm()}
              onCreateSection={(name) => onCreateSection(name)}
            />
          ) : !isCreatingSection ? (
            <Box>
              <Button
                variant="outline"
                onClick={() => onOpenCreateSectionForm()}
              >
                Create Section
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Stack>
  );
};

export default ProjectDetailListView;
