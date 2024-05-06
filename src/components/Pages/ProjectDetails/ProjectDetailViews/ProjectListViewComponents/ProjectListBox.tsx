import { Box, useDisclosure } from "@chakra-ui/react";
import React from "react";
import SectionHeader from "../../SectionTable/SectionHeader";
import TaskRow from "../../SectionTable/TaskRow";
import { Section, Task } from "../../../../../types/types";
import CreateTaskRow from "../../SectionTable/CreateTaskRow";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteModal } from "../../DeleteModal/DeleteModal";

type ProjectListBoxProps = {
  section: Section;
  onDeleteSection: (taskId: string) => void;
  hiddenSections: string[];
  onHideSectionId: (sectionId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  onDuplicateTask: (task: Task, sectionId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
};

export const ProjectListBox: React.FC<ProjectListBoxProps> = ({
  section,
  onDeleteSection,
  onHideSectionId,
  hiddenSections,
  onEditTask,
  onOpenTaskDetails,
  onDuplicateTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: section.id,
      data: {
        type: "section",
        section,
      },
    });

  const deleteTaskModal = useDisclosure();

  const tasksId = section.tasks.map((task) => task.id);
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };
  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SectionHeader
        section={section}
        onDeleteSection={deleteTaskModal.onOpen}
        onToggleHideSection={() => onHideSectionId(section.id)}
        hiddenSections={hiddenSections}
      />
      {!hiddenSections.some((sectionId) => sectionId === section.id) && (
        <div>
          <SortableContext strategy={rectSortingStrategy} items={tasksId}>
            {section.tasks.map((task) => (
              <TaskRow
                onChangeDate={(task) => onEditTask(task)}
                onChangePriority={(task) => onEditTask(task)}
                onOpenTaskDetails={(task) =>
                  onOpenTaskDetails(task, section.id)
                }
                onDuplicateTask={(task) => onDuplicateTask(task, section.id)}
                key={task.id}
                task={task}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                sectionId={section.id}
              />
            ))}
          </SortableContext>

          <CreateTaskRow
            onCreateTask={(task) => {
              onCreateTask(task, section.id);
            }}
          />
        </div>
      )}
      
      <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => onDeleteSection(section.id)}
      />
    </Box>
  );
};
