import { Box, Button, Stack } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import SectionHeader from "./SectionTable/SectionHeader";
import ExampleTaskRow from "./SectionTable/ExampleTaskRow";
import TaskRow from "./SectionTable/TaskRow";
import CreateTaskRow from "./SectionTable/CreateTaskRow";
import { AddIcon } from "@chakra-ui/icons";

type ProjectDetailListViewProps = {
  onEditTask: (task: Task) => void;
  isCreatingSection: boolean;
  project: Project | null | undefined;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  isCreateSectionFormVisible: boolean;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  onDeleteTask: (taskId: string) => void;
  hiddenSections: string[];
  onHideSectionId: (sectionId: string) => void;
  onDuplicateTask: (task: Task, sectionId: string) => void;
};

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({
  hiddenSections,
  onDeleteTask,
  onHideSectionId,
  onDuplicateTask,
  project,
  onDeleteSection,
  onOpenTaskDetails,
  onEditTask,
  isCreateSectionFormVisible,
  onCreateTask,
  isCreatingSection,
  onCloseCreateSectionForm,
  onCreateSection,
  onOpenCreateSectionForm
}) => {
  return (
    <Stack overflow="auto" h="85%">
      <ExampleTaskRow />
      {project &&
        project.sections.map((section) => (
          <div key={section.id}>
            <SectionHeader
              section={section}
              onDeleteSection={() => onDeleteSection(section.id)}
              onToggleHideSection={() => onHideSectionId(section.id)}
              hiddenSections={hiddenSections}
            />

            {!hiddenSections.some((sectionId) => sectionId === section.id) && (
              <div>
                {section.tasks.map((task) => (
                  <TaskRow
                    onChangeDate={(task) => onEditTask(task)}
                    onChangePriority={(task) => onEditTask(task)}
                    onOpenTaskDetails={(task) =>
                      onOpenTaskDetails(task, section.id)
                    }
                    onDuplicateTask={(task) =>
                      onDuplicateTask(task, section.id)
                    }
                    key={task.id}
                    task={task}
                    onDeleteTask={onDeleteTask}
                    onEditTask={onEditTask}
                  />
                ))}
                <CreateTaskRow
                  onCreateTask={(task) => {
                    onCreateTask(task, section.id);
                  }}
                />
              </div>
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
            <Button leftIcon={<AddIcon />} variant="outline" onClick={() => onOpenCreateSectionForm()}>
              Create Section
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default ProjectDetailListView;
