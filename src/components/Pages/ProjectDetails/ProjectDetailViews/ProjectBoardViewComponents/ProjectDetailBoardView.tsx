import {
  Stack,
  Card,
  Button,
  // Text
} from "@chakra-ui/react";
import { Project, Task } from "../../../../../types/types";
import { AddIcon } from "@chakra-ui/icons";
import CreateSectionForm from "../../CreateSectionForm/CreateSectionForm";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SectionCardBoard from "./SectionCardBoard/SectionCardBoard";
import TaskCardBoard from "./TaskCardBoard/TaskCardBoard";
import { createPortal } from "react-dom";
import { useDndProject } from "../../../../hooks/useDndProject";

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
  onChangeObjectLocation: (data: DragEndEvent) => void;
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
  onChangeObjectLocation,
}) => {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(sensor);
  const dndProject = useDndProject(project);
  const projectToRender = dndProject.project || project;
  const renderDragOverlay = () => {
    if (dndProject.activeTask) {
      if (!projectToRender) return;
      const section = projectToRender.sections?.find((section) =>
        section.tasks.find((task) => task.id === dndProject.activeTask?.id)
      );
      if (!section) return;
      return (
        <DragOverlay>
          <TaskCardBoard
            key={dndProject.activeTask.id}
            task={dndProject.activeTask}
            sectionId={section.id}
            onCreateTask={onCreateTask}
            onEditTask={onEditTask}
            onOpenTaskDetails={onOpenTaskDetails}
          />
        </DragOverlay>
      );
    }
    if (dndProject.activeSection) {
      return (
        <DragOverlay>
          <SectionCardBoard
            section={dndProject.activeSection}
            onCreateTask={onCreateTask}
            onDeleteSection={onDeleteSection}
            onEditTask={onEditTask}
            onOpenTaskDetails={onOpenTaskDetails}
            key={dndProject.activeSection.id}
          />
        </DragOverlay>
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragOver={dndProject.handleDragOver}
      onDragStart={dndProject.handleDragStart}
      onDragEnd={(e) => {
        dndProject.handleDragEnd(), onChangeObjectLocation(e);
      }}
      collisionDetection={closestCorners}
    >
      <Stack direction="row" overflow="auto" h="85%">
        {projectToRender && (
          <SortableContext
            strategy={rectSortingStrategy}
            items={projectToRender.sections.map((section) => section.id)}
          >
            {projectToRender.sections.map((section) => (
              <SectionCardBoard
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
        <Card variant="outline" minH="100%" w={60} minW={60} p={1} ml={1}>
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
          <Card
            mb={2}
            h="100%"
            bgGradient="linear(to-b, gray.700, gray.800)"
          ></Card>
        </Card>
      </Stack>
      {createPortal(renderDragOverlay(), document.body)}
    </DndContext>
  );
};

export default ProjectDetailBoardView;
