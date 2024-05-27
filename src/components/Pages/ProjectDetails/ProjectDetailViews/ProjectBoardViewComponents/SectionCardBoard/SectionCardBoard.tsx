import {
  Stack,
  Card,
  Heading,
  CardBody,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { CreateTaskCard } from "../CreateTaskCard/CreateTaskCard";
import { EllipsisHorizontal } from "../../../../../UI/Icons/EllipsisHorizontal";
import { DeleteIcon } from "@chakra-ui/icons";
import { Section, Task } from "../../../../../../types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCardBoard from "../TaskCardBoard/TaskCardBoard";
import { useMemo } from "react";
import { DeleteModal } from "../../../DeleteModal/DeleteModal";

type SectionCardBoardProps = {
  section: Section;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  onEditTask: (task: Task) => void;
};

type SectionMenuProps = {
  onDeleteSection: () => void;
};

const SectionMenu: React.FC<SectionMenuProps> = ({ onDeleteSection }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<EllipsisHorizontal />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem onClick={onDeleteSection} icon={<DeleteIcon />}>
          Delete Section
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const SectionCardBoard: React.FC<SectionCardBoardProps> = ({
  section,
  onDeleteSection,
  onCreateTask,
  onOpenTaskDetails,
  onEditTask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "section",
      section,
    },
  });

  const tasksId = useMemo(
    () => section.tasks.map((item) => item.id),
    [section]
  );
  const deleteTaskModal = useDisclosure();

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Stack mr={1} ml={1} maxW={72} minW={60}>
      <Card
        zIndex={isDragging ? 1000 : 0}
        variant="outline"
        h="100%"
        w={64}
        p={1}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <Stack direction="row" alignItems="center">
          <Heading size="md" p={3}>
            {section.name}
          </Heading>
          <SectionMenu onDeleteSection={deleteTaskModal.onOpen} />
        </Stack>
        {section.tasks.length === 0 ? (
          <Card
            mb={2}
            h="100%"
            minH={80}
            bgGradient="linear(to-b, gray.700, gray.800)"
          >
            <CardBody>
              <CreateTaskCard
                onCreateTask={(task) => onCreateTask(task, section.id)}
              />
            </CardBody>
          </Card>
        ) : (
          <Box
          overflowX="auto"
          overflowY="visible"
          // overflow="auto"
          >
            <SortableContext items={tasksId}>
              {section.tasks.map((task) => (
                <TaskCardBoard
                  key={task.id}
                  task={task}
                  sectionId={section.id}
                  onCreateTask={onCreateTask}
                  onEditTask={onEditTask}
                  onOpenTaskDetails={onOpenTaskDetails}
                />
              ))}
            </SortableContext>
            <Card bg="transparent" mt={1} h={40}>
              <CardBody>
                <CreateTaskCard
                  onCreateTask={(task) => onCreateTask(task, section.id)}
                />
              </CardBody>
            </Card>
          </Box>
        )}
      </Card>

      <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => onDeleteSection(section.id)}
      />
    </Stack>
  );
};

export default SectionCardBoard;
