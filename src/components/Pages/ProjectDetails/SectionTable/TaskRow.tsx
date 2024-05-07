import {
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, Search2Icon } from "@chakra-ui/icons";
import { Task } from "../../../../types/types";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import PriorityForm from "../PriorityForm/PriorityForm";
import DatePicker from "./DatePicker/DatePicker";
import { EllipsisHorizontal } from "../../../UI/Icons/EllipsisHorizontal";
import { EditNameInput } from "../ProjectDetailViews/EditNameInput";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteModal } from "../DeleteModal/DeleteModal";

type TaskRowProps = {
  onChangePriority: (task: Task) => void;
  onChangeDate: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task;
  sectionId: string;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
  onOpenTaskDetails: (taskId: string) => void;
};

const TaskRow: React.FC<TaskRowProps> = ({
  onDeleteTask,
  task,
  onEditTask,
  onOpenTaskDetails,
  onChangeDate,
  onChangePriority,
}) => {
  const [selectedDate, setSelectedDate] = useState(task.date);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });
  const deleteTaskModal = useDisclosure()
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Grid
      h={16}
      templateColumns="2fr 1fr 1fr "
      borderBottom="1px solid black"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GridItem
        p={2}
        ml={10}
        borderRight="1px solid black"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <EditNameInput task={task} onEditTask={onEditTask} />
        <Menu>
          <MenuButton
            ml={2.5}
            as={IconButton}
            icon={<EllipsisHorizontal />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem
              onClick={deleteTaskModal.onOpen}
              icon={<DeleteIcon />}
            >
              Delete Task
            </MenuItem>
            <MenuItem
              onClick={() => onOpenTaskDetails(task.id)}
              icon={<Search2Icon/>}
            >
              Task Details
            </MenuItem>
          </MenuList>
        </Menu>
      </GridItem>
      <GridItem
        borderRight="1px solid black"
        display="flex"
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
        borderRight="1px solid black"
        display="flex"
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
         {/* const deleteTaskModal = useDisclosure(); */}
         <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => onDeleteTask(task.id)}
      />
    </Grid>
  );
};

export default TaskRow;
