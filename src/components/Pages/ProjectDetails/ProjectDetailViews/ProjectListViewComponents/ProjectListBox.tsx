import { Box, useDisclosure } from "@chakra-ui/react";
import React from "react";
import SectionHeader from "../../SectionTable/SectionHeader";
import TaskRow from "../../SectionTable/TaskRow";
import { Section, Task } from "../../../../../types/types";
import CreateTaskRow from "../../SectionTable/CreateTaskRow";
import { DeleteModal } from "../../DeleteModal/DeleteModal";
import { ChangeTaskLocationData } from "../../../../../api/projectsApi";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  sections: Section[];
  onChangeTaskLocation: (data: ChangeTaskLocationData) => void;
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
  sections,
  onChangeTaskLocation,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: section.id,
    data: {
      type: "section",
      section,
    },
    animateLayoutChanges: () => false,
  });
  const deleteTaskModal = useDisclosure();
  const style = {
    transition: "transform 300ms ease",
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Box>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <SectionHeader
          section={section}
          onDeleteSection={deleteTaskModal.onOpen}
          onToggleHideSection={() => onHideSectionId(section.id)}
          hiddenSections={hiddenSections}
        />
      </div>
      {!hiddenSections.some((sectionId) => sectionId === section.id) && (
        <div>
          <SortableContext items={section.tasks.map((task) => task.id)}>
            {section.tasks.map((task) => (
              <TaskRow
                onChangeTaskLocation={onChangeTaskLocation}
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
                sections={sections}
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
