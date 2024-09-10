import {
  Stack,
  Card,
  Heading,
  CardBody,
  IconButton,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { CreateTaskCard } from "../CreateTaskCard/CreateTaskCard";
import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Section, Task } from "../../../../../../types/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCardBoard from "../TaskCardBoard/TaskCardBoard";
import { DeleteModal } from "../../../DeleteModal/DeleteModal";
import { CustomScrollbar } from "../../../../../../config";

type SectionCardBoardProps = {
  section: Section;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  onEditTask: (task: Task) => void;
  activeSection: Section | null;
};

const SectionCardBoard: React.FC<SectionCardBoardProps> = ({
  section,
  onDeleteSection,
  onCreateTask,
  onOpenTaskDetails,
  onEditTask,
  activeSection,
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
    transform: CSS.Translate.toString(transform),
    opacity: activeSection?.id == section.id && isDragging ? 0 : 1,
  };

  return (
    <Stack mr={1} ml={1} maxW={80} minW={80} h="100%">
      <Card
        variant="outline"
        h="100%"
        w={80}
        p={1}
        ref={setNodeRef}
        style={style}
        backgroundColor="gray.800"
        _hover={{ border: "1px solid black", ".hiddenButton": { opacity: 1 } }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack flexDirection="row" alignItems="center">
            <div {...attributes} {...listeners}>
              <IconButton
                opacity={0}
                className="hiddenButton"
                aria-label="Search database"
                icon={<DragHandleIcon />}
                variant="ghost"
              />
            </div>
            <Heading size="md" p={3} pl={0}>
              {section.name}
            </Heading>
          </Stack>
          <Tooltip label="Delete Section">
            <IconButton
              onClick={deleteTaskModal.onOpen}
              className="hiddenButton"
              color="red"
              opacity={0}
              aria-label="Search database"
              icon={<DeleteIcon />}
              variant="ghost"
            />
          </Tooltip>
        </Stack>
        <Stack
          overflowY="auto"
          css={CustomScrollbar}
          flexDirection="column"
          alignItems="center"
          h="100%"
        >
          {section.tasks.length === 0 ? (
            <Card
              mb={2}
              h="100%"
              minH={80}
              w={64}
              bgGradient="linear(to-b, gray.700, gray.800)"
            >
              <CardBody>
                <CreateTaskCard
                  sectionId={section.id}
                  onCreateTask={(task) => onCreateTask(task, section.id)}
                />
              </CardBody>
            </Card>
          ) : (
            <Stack flexDirection="column" justifyContent="center">
              <SortableContext items={section.tasks.map((task) => task.id)}>
                {section.tasks.map((task) => (
                  <TaskCardBoard
                    key={task.id.toString()}
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
                    sectionId={section.id}
                    onCreateTask={(task) => onCreateTask(task, section.id)}
                  />
                </CardBody>
              </Card>
            </Stack>
          )}
        </Stack>
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
