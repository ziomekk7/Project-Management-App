import { Box, Button, Stack } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import ExampleTaskRow from "../SectionTable/ExampleTaskRow";
import { AddIcon } from "@chakra-ui/icons";
import {
  ChangeSectionLocationData,
  ChangeTaskLocationData,
} from "../../../../api/projectsApi";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ProjectListBox } from "./ProjectListViewComponents/ProjectListBox";

type ProjectDetailListViewProps = {
  onEditTask: (task: Task) => void;
  isCreatingSection: boolean;
  project: Project;
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
  onChangeSectionLocation: (data: ChangeSectionLocationData) => void;
  onChangeTaskLocation: (data: ChangeTaskLocationData) => void;
  onChangeObjectLocation: (data: DragEndEvent) => void;
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
  onOpenCreateSectionForm,
  onChangeObjectLocation,
  
}) => {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(sensor);
  if (!project) {
    return;
  }

  const sectionsId = project.sections.map((section) => section.id);
  if (!sectionsId) {
    return;
  }


  return (
    <Stack overflow="auto" h="85%">
      <ExampleTaskRow />
      <DndContext
        sensors={sensors}
        onDragEnd={(event: DragEndEvent) => onChangeObjectLocation(event)}
        collisionDetection={closestCenter}
      >
        <SortableContext strategy={rectSortingStrategy} items={sectionsId}>
          {project.sections.map((section) => (
            <ProjectListBox
              key={section.id}
              section={section}
              onCreateTask={onCreateTask}
              onDeleteSection={onDeleteSection}
              hiddenSections={hiddenSections}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onDuplicateTask={onDuplicateTask}
              onOpenTaskDetails={onOpenTaskDetails}
              onHideSectionId={onHideSectionId}
            />
          ))}
        </SortableContext>
      </DndContext>
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
              leftIcon={<AddIcon />}
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
