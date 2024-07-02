import {
  Stack,
  Card,
  Button,
  // Text
} from "@chakra-ui/react";
import { Project, Section, Task } from "../../../../../types/types";
import { AddIcon } from "@chakra-ui/icons";
import CreateSectionForm from "../../CreateSectionForm/CreateSectionForm";
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
import SectionCardBoard from "./SectionCardBoard/SectionCardBoard";
import TaskCardBoard from "./TaskCardBoard/TaskCardBoard";
import { createPortal } from "react-dom";

type ProjectDetailBoardViewProps = {
  isCreatingSection: boolean;
  project: Project | null | undefined;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  isCreateSectionFormVisible: boolean;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  onEditTask: (task: Task) => void;
  onDragOver: (data: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  activeSection: Section | null;
  activeTask: Task | null;
};

const ProjectDetailBoardView: React.FC<ProjectDetailBoardViewProps> = ({
  isCreatingSection,
  project,
  onOpenTaskDetails,
  isCreateSectionFormVisible,
  onCreateSection,
  onDeleteSection,
  onCreateTask,
  onOpenCreateSectionForm,
  onCloseCreateSectionForm,
  onEditTask,
  onDragOver,
  activeSection,
  activeTask,
  onDragEnd,
  onDragStart,
}) => {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(sensor);
  const renderDragOverlay = () => {
    if (activeTask) {
      if (!project) return;
      const section = project.sections.find((section) =>
        section.tasks.find((task) => task.id === activeTask.id)
      );
      if (!section) return;
      return (
        <DragOverlay>
          <TaskCardBoard
            key={activeTask.id}
            task={activeTask}
            sectionId={section.id}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
            onOpenTaskDetails={onOpenTaskDetails}
          />
        </DragOverlay>
      );
    }
    if (activeSection) {
      return (
        <DragOverlay>
          <SectionCardBoard
            activeSection={activeSection}
            section={activeSection}
            onCreateTask={onCreateTask}
            onDeleteSection={onDeleteSection}
            onEditTask={onEditTask}
            onOpenTaskDetails={onOpenTaskDetails}
            key={activeSection.id}
          />
        </DragOverlay>
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDragEnd={(e) => {
        onDragEnd(e);
      }}
      collisionDetection={closestCorners}
    >
      <Stack direction="row" overflow="auto" h="85%">
        {project && (
          <SortableContext
            strategy={rectSortingStrategy}
            items={project.sections.map((section) => section.id)}
          >
            {project.sections.map((section) => (
              <SectionCardBoard
                activeSection={activeSection}
                section={section}
                onCreateTask={onCreateTask}
                onDeleteSection={onDeleteSection}
                onEditTask={onEditTask}
                onOpenTaskDetails={onOpenTaskDetails}
                key={section.id}
              />
            ))}
          </SortableContext>
        )}
        <Card variant="outline" minH="100%" w={60} minW={60} p={1} ml={1} bgGradient="linear(to-b, gray.700, gray.800)">
          <Stack direction="row" justify="center" mb={2}>
            {isCreateSectionFormVisible ? (
              <CreateSectionForm
                isCreatingSection={isCreatingSection}
                onClose={() => onCloseCreateSectionForm()}
                onCreateSection={(name) => onCreateSection(name)}
              />
            ) : !isCreatingSection ? (
              <Button
                leftIcon={<AddIcon />}
                w="100%"
                variant="outline"
                onClick={() => onOpenCreateSectionForm()}
              >
                Create Section
              </Button>
            ) : null}
          </Stack>
        </Card>
      </Stack>
      {createPortal(renderDragOverlay(), document.body)}
    </DndContext>
  );
};

export default ProjectDetailBoardView;
