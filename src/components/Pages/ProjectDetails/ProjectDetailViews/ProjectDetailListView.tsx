import { Box, Button, Stack, useBreakpointValue } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import ExampleTaskRow from "../SectionTable/ExampleTaskRow";
import { AddIcon } from "@chakra-ui/icons";
import { ChangeTaskLocationData } from "../../../../api/projectsApi";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  // closestCenter,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ProjectListBox } from "./ProjectListViewComponents/ProjectListBox";
import { showMd } from "../../../UI/RespoStyles";
import { useDndProject } from "../../../hooks/useDndProject";
import { createPortal } from "react-dom";
import TaskRow from "../SectionTable/TaskRow";

type ProjectDetailListViewProps = {
  onEditTask: (task: Task) => void;
  isCreatingSection: boolean;
  project: Project | undefined;
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
}) => {
  const hideOnSmallResolutions = useBreakpointValue(showMd);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(sensor);
  const dndProject = useDndProject(project);
  const projectToRender = dndProject.project || project;
  const renderDragOverlay = () => {
    if (!projectToRender) return;
    const section = projectToRender.sections?.find((section) =>
      section.tasks.find((task) => task.id === dndProject.activeTask?.id)
    );
    if (!section) return;
    if (dndProject.activeTask) {
      return (
        <DragOverlay>
          <TaskRow
              onChangeTaskLocation={onChangeTaskLocation}
              onChangeDate={(task) => onEditTask(task)}
              onChangePriority={(task) => onEditTask(task)}
              onOpenTaskDetails={(task) => onOpenTaskDetails(task, section.id)}
              onDuplicateTask={(task) => onDuplicateTask(task, section.id)}
              key={dndProject.activeTask.id}
              task={dndProject.activeTask}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              sectionId={section.id}
              sections={projectToRender.sections}
            />
        </DragOverlay>
      );
    }
    if (dndProject.activeSection) {
      return (
        <DragOverlay>
          <ProjectListBox
            onChangeTaskLocation={onChangeTaskLocation}
            sections={projectToRender.sections}
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
        </DragOverlay>
      );
    }
  };
  if (!projectToRender) {
    return;
  }

  return (
    <Stack overflow="auto" h="85%">
      <Box display={hideOnSmallResolutions}>
        <ExampleTaskRow />
      </Box>
      <DndContext
        sensors={sensors}
        onDragOver={dndProject.handleDragOver}
        onDragStart={dndProject.handleDragStart}
        onDragEnd={(e) => {
          dndProject.handleDragEnd(), onChangeObjectLocation(e);
        }}
        collisionDetection={closestCorners}
      >
        <SortableContext
          strategy={rectSortingStrategy}
          items={projectToRender.sections.map((section) => section.id)}
        >
          {projectToRender.sections.map((section) => (
            <ProjectListBox
              onChangeTaskLocation={onChangeTaskLocation}
              sections={projectToRender.sections}
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
