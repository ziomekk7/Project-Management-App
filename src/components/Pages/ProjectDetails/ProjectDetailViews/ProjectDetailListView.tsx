import {
  Box,
  Button,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Section, Task } from "../../../../types/types";
import ExampleTaskRow from "../SectionTable/ExampleTaskRow";
import {
  AddIcon,
} from "@chakra-ui/icons";
import { ChangeTaskLocationData } from "../../../../api/projectsApi";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ProjectListBox } from "./ProjectListViewComponents/ProjectListBox";
import { showMd } from "../../../UI/RespoStyles";
import { createPortal } from "react-dom";
import TaskRow from "../SectionTable/TaskRow";

type ProjectDetailListViewProps = {
  onEditTask: (task: Task) => void;
  isCreatingSection: boolean;
  project: Project | undefined | null;
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
  onChangeTaskLocation: (data: ChangeTaskLocationData) => void;
  onChangeObjectLocation: (data: DragEndEvent) => void;
  onDragOver: (data: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  activeSection: Section | null;
  activeTask: Task | null;
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
  onChangeTaskLocation,
  onChangeObjectLocation,
  onDragOver,
  onDragEnd,
  onDragStart,
  activeTask,
  activeSection,
}) => {
  const hideOnSmallResolutions = useBreakpointValue(showMd);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(sensor);

  const renderDragOverlay = () => {
    if (!project) return;

    if (activeTask) {
      const section = project.sections?.find((section) =>
        section.tasks.find((task) => task.id === activeTask?.id)
      );
      if (!section) return;
      return (
        <DragOverlay>
          <TaskRow
            activeTask={activeTask}
            onChangeTaskLocation={onChangeTaskLocation}
            onChangeDate={(task) => onEditTask(task)}
            onChangePriority={(task) => onEditTask(task)}
            onOpenTaskDetails={(task) => onOpenTaskDetails(task, section.id)}
            onDuplicateTask={(task) => onDuplicateTask(task, section.id)}
            key={activeTask.id}
            task={activeTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            sectionId={section.id}
            sections={project.sections}
          />
        </DragOverlay>
      );
    }
    if (activeSection) {
      return (
        <DragOverlay>
          <ProjectListBox
            activeTask={activeTask}
            activeSection={activeSection}
            onChangeTaskLocation={onChangeTaskLocation}
            sections={project.sections}
            key={activeSection.id}
            section={activeSection}
            onCreateTask={onCreateTask}
            onDeleteSection={onDeleteSection}
            hiddenSections={hiddenSections}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDuplicateTask={onDuplicateTask}
            onOpenTaskDetails={onOpenTaskDetails}
            onHideSectionId={onHideSectionId}
          />
        </DragOverlay>
      );
    }
  };
  if (!project) {
    return;
  }

  return (
    <Stack overflow="auto" h="85%">
      <Box display={hideOnSmallResolutions}>
        <ExampleTaskRow />
      </Box>
      <DndContext
        sensors={sensors}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDragEnd={(e) => {
          onDragEnd(e), onChangeObjectLocation(e);
        }}
        collisionDetection={closestCorners}
      >
        <SortableContext
          strategy={rectSortingStrategy}
          items={project.sections.map((section) => section.id)}
        >
          {project.sections.map((section) => (
            <ProjectListBox
              activeTask={activeTask}
              activeSection={activeSection}
              onChangeTaskLocation={onChangeTaskLocation}
              sections={project.sections}
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
        {createPortal(renderDragOverlay(), document.body)}
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
