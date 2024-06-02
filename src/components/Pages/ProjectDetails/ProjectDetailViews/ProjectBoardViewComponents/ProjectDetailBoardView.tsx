import { Stack, Card, Button } from "@chakra-ui/react";
import { Project, Task } from "../../../../../types/types";
import { AddIcon } from "@chakra-ui/icons";
import CreateSectionForm from "../../CreateSectionForm/CreateSectionForm";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SectionCardBoard from "./SectionCardBoard/SectionCardBoard";

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
  if (!project) {
    return;
  }
  const sectionsId = project.sections.map((section) => section.id);
  if (!sectionsId) {
    return;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(event: DragEndEvent) => onChangeObjectLocation(event)}
      collisionDetection={closestCenter}
    >
      <Stack direction="row" overflow="auto" h="85%">
        {project && (
          <SortableContext strategy={rectSortingStrategy} items={sectionsId}>
            {project.sections.map((section) => (
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
    </DndContext>
  );
};

export default ProjectDetailBoardView;
