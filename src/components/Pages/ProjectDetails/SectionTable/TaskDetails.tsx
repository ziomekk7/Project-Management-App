import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  MenuItem,
  Stack,
  MenuButton,
  IconButton,
  Menu,
  MenuList,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { EllipsisHorizontal } from "../../../UI/Icons/EllipsisHorizontal";
import { CopyIcon, DeleteIcon } from "@chakra-ui/icons";
import DatePicker from "./DatePicker/DatePicker";
import { Task, TaskPriority } from "../../../../types/types";
import PriorityForm from "../PriorityForm/PriorityForm";
import DuplicateTaskModal from "./DuplicateTaskModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DeleteModal } from "../DeleteModal/DeleteModal";

type TaskDetailsProps = {
  task: Task;
  onEditTask: (task: Task) => void;
  selectedPriority: TaskPriority;
  taskDate: Date | null;
  selectedDate: Date | null;
  onDeleteTask: (taskId: string) => void;
  isOpenMenu: boolean;
  onClose: () => void;
  onDuplicateTask: (task: Task) => void;
  onOpenDeleteModal: (taskId: string) => void;
};

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  selectedPriority,
  taskDate,
  selectedDate,
  onEditTask,
  onDeleteTask,
  isOpenMenu,
  onClose,
  onDuplicateTask,
}) => {
  const duplicateTaskModal = useDisclosure();
  const deleteTaskModal = useDisclosure();

  const [inputValue, setInputValue] = useState(task.description);
  const [debouncedValue] = useDebounce(inputValue, 800);

  const prevDescriptionRef = useRef(task.description);

  useEffect(() => {
    setInputValue(task.description);
  }, [task.description]);

  useEffect(() => {
    const prevDescription = prevDescriptionRef.current;
    if (debouncedValue !== prevDescription) {
      onEditTask({ ...task, description: debouncedValue });
      prevDescriptionRef.current = debouncedValue;
    }
  }, [debouncedValue, task, onEditTask]);

  useEffect(() => {
    const currentProjectName = document.title.replace("Management", "").trim();
    document.title = task.name
      ? `${currentProjectName} ${task.name}`
      : "Management";
    return () => {
      document.title = `${currentProjectName} Management`;
    };
  }, [task]);
  console.log(task);

  return (
    <>
      <Drawer size="sm" isOpen={isOpenMenu} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex alignItems="center">
              <Heading as="h3" size="md">
                {task.name}
              </Heading>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<EllipsisHorizontal />}
                  variant="ghost"
                  ml={2.5}
                />
                <MenuList>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={deleteTaskModal.onOpen}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    icon={<CopyIcon />}
                    onClick={duplicateTaskModal.onOpen}
                  >
                    Duplicate Task
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <Flex alignItems="center">
                <Text>Execution Date</Text>
                <DatePicker
                  taskDate={taskDate}
                  selectedDate={selectedDate}
                  onSelect={(date) => onEditTask({ ...task, date })}
                />
              </Flex>
              <Flex alignItems="center">
                <Text>Priority</Text>
                <PriorityForm
                  onChangePriority={(priority) =>
                    onEditTask({ ...task, priority })
                  }
                  selectedPriority={selectedPriority}
                />
              </Flex>
              <ReactQuill value={inputValue || ""} onChange={setInputValue} />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <DuplicateTaskModal
        onDuplicateTask={onDuplicateTask}
        task={task}
        isOpen={duplicateTaskModal.isOpen}
        onClose={duplicateTaskModal.onClose}
      />

      <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => {
          deleteTaskModal.onClose();
          onClose();
          onDeleteTask(task.id);
        }}
      />
    </>
  );
};

export default TaskDetails;
