import {
  Box,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import TaskRow from "../../SectionTable/TaskRow";
import { Section, Task } from "../../../../../types/types";
import CreateTaskRow from "../../SectionTable/CreateTaskRow";
import { DeleteModal } from "../../DeleteModal/DeleteModal";
import { ChangeTaskLocationData } from "../../../../../api/projectsApi";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DeleteIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import { EllipsisHorizontal } from "../../../../UI/Icons/EllipsisHorizontal";

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
  activeSection: Section | null;
  activeTask: Task | null;
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
  activeSection,
  activeTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
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
    opacity: activeSection?.id == section.id && isDragging ? 0 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      <div>
        <Stack
          h={20}
          mt={3}
          borderBottom="1px solid black"
          key={section.id}
          direction="row"
          spacing={4}
          alignItems="center"
          w="100%"
        >
          <div {...attributes} {...listeners}>
            <IconButton
              aria-label="Search database"
              icon={<DragHandleIcon />}
              variant="ghost"
            />
          </div>
          <IconButton
            aria-label="Toggle section"
            icon={
              !hiddenSections.find((sectionId) => sectionId === section.id) ? (
                <ChevronDownIcon />
              ) : (
                <ChevronRightIcon />
              )
            }
            onClick={() => onHideSectionId(section.id)}
            variant="ghost"
          />

          <Heading as="h2" size="md">
            {section.name}
          </Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<EllipsisHorizontal />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={deleteTaskModal.onOpen} icon={<DeleteIcon />}>
                Delete Section
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </div>
      {!hiddenSections.some((sectionId) => sectionId === section.id) && (
        <div>
          <SortableContext items={section.tasks.map((task) => task.id)}>
            {section.tasks.map((task) => (
              <TaskRow
                activeTask={activeTask}
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
