import {
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  Text,
  MenuItem,
  IconButton,
  useDisclosure,
  useBreakpointValue,
  MenuGroup,
  Flex,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { DragHandleIcon, Search2Icon, UpDownIcon } from "@chakra-ui/icons";
import { Section, Task } from "../../../../types/types";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import PriorityForm from "../PriorityForm/PriorityForm";
import DatePicker from "./DatePicker/DatePicker";
import { EditNameInput } from "../ProjectDetailViews/EditNameInput";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import { ChangeTaskLocationData } from "../../../../api/projectsApi";

type TaskRowProps = {
  onChangePriority: (task: Task) => void;
  onChangeDate: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task;
  sectionId: string;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onOpenTaskDetails: (taskId: string) => void;
  onChangeTaskLocation: (data: ChangeTaskLocationData) => void;
  sections: Section[];
  activeTask: Task | null;
};

const TaskRow: React.FC<TaskRowProps> = ({
  onDeleteTask,
  task,
  onEditTask,
  onOpenTaskDetails,
  onChangeDate,
  onChangePriority,
  onChangeTaskLocation,
  sections,
  sectionId,
  activeTask,
}) => {
  const [selectedDate, setSelectedDate] = useState(task.date);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });
  const deleteTaskModal = useDisclosure();
  const hideOnSmallResolutions = useBreakpointValue({
    base: { display: "none", templateColumns: "1fr" },
    md: { display: "flex", templateColumns: "4fr 1fr 1fr" },
    lg: { display: "flex", templateColumns: "4fr 1fr 1fr" },
  });
  const borderColor = "gray.700";
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: activeTask?.id === task.id && isDragging ? 0 : 1,
  };

  const handleChangeTaskLocation = (movedSectionId: string) => {
    if (sectionId == movedSectionId) {
      return;
    }
    onChangeTaskLocation({
      taskId: task.id,
      destinationSectionId: movedSectionId,
      destinationIndex: 0,
    });
  };

  return (
    <Grid
      h={14}
      templateColumns={hideOnSmallResolutions?.templateColumns}
      borderBottom="1px solid "
      borderColor={borderColor}
      ref={setNodeRef}
      style={style}
    >
      <GridItem
        p={2}
        borderRight="1px solid "
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        _hover={{ ".hiddenButton": { opacity: 1 } }}
        onClick={() => onOpenTaskDetails(task.id)}
      >
        <Stack flexDir="row" {...attributes} {...listeners}>
          <IconButton
            className="hiddenButton"
            opacity={0}
            aria-label="Search database"
            icon={<DragHandleIcon />}
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
          />
          <EditNameInput task={task} onEditTask={onEditTask} />
        </Stack>
        <Flex>
          <Menu>
            <Tooltip label="Move task to another section">
              <MenuButton
                className="hiddenButton"
                opacity={0}
                as={IconButton}
                icon={<UpDownIcon />}
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
            <MenuList>
              <MenuGroup title="Move task to section:">
                {sections.map((section) => (
                  <MenuItem
                    key={section.id}
                    onClick={(e) => {
                      handleChangeTaskLocation(section.id), e.stopPropagation();
                    }}
                    _hover={{ backgroundColor: "gray.600" }}
                    backgroundColor={
                      section.id == sectionId ? "gray.500" : "gray.700"
                    }
                  >
                    <Text ml="16px">{section.name}</Text>
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
          <Tooltip label="Task details">
            <IconButton
              onClick={(e) =>{ onOpenTaskDetails(task.id), e.stopPropagation()}}
              className="hiddenButton"
              opacity={0}
              aria-label="Search database"
              icon={<Search2Icon />}
              variant="ghost"
            />
          </Tooltip>
        </Flex>
      </GridItem>
      <GridItem
        borderRight="1px solid "
        borderColor={borderColor}
        display={hideOnSmallResolutions?.display}
        alignItems="center"
        justifyContent="center"
      >
        <DatePicker
          taskDate={task.date}
          selectedDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            onChangeDate({
              name: task.name,
              id: task.id,
              date: date,
              priority: task.priority,
              description: task.description,
            });
          }}
        />
      </GridItem>
      <GridItem
        display={hideOnSmallResolutions?.display}
        alignItems="center"
        justifyContent="flex-start"
        ml={5}
      >
        <PriorityForm
          onChangePriority={(priority) => {
            onChangePriority({
              name: task.name,
              id: task.id,
              date: task.date,
              priority: priority,
              description: task.description,
            });
          }}
          selectedPriority={task.priority}
        />
      </GridItem>
      <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => onDeleteTask(task.id)}
      />
    </Grid>
  );
};

export default TaskRow;
