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
  Textarea,
  Menu,
  MenuList,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Task } from "../../../../../types/types";
import PriorityForm from "../../PriorityForm/PriorityForm";
import { TaskPriority } from "../../../../../types/types";
import DatePicker from "./DatePicker/DatePicker";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import DuplicateTaskModal from "./DuplicateTaskModal";
import { DeleteIcon } from "@chakra-ui/icons";
import { EllipsisHorizontal } from "../../../../UI/Icons/EllipsisHorizontal";

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
  const [inputValue, setInputValue] = useState(task.description);
  const [debouncedValue] = useDebounce(inputValue, 2000);
  useEffect(() => {
    onEditTask({ ...task, description: debouncedValue });
  }, [debouncedValue]);

  const handleChangeDescription = (description: string) => {
    setInputValue(description);
  };

  return (
    <>
      <Drawer size="sm" isOpen={isOpenMenu} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent justifyContent="row-reverse">
          <DrawerCloseButton />

          <DrawerHeader></DrawerHeader>

          <DrawerBody>
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
                    onClick={() => {
                      onDeleteTask(task.id), onClose();
                    }}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    icon={<i className="fa-solid fa-copy" />}
                    onClick={duplicateTaskModal.onOpen}
                  >
                    Duplicate Task
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            <Stack display="flex" alignItems="center" direction="row" mt={1.5}>
              <Text>Execution Date </Text>
              <DatePicker
                taskDate={taskDate}
                selectedDate={selectedDate}
                onSelect={(selectedDate) =>
                  onEditTask({ ...task, date: selectedDate })
                }
              />
            </Stack>
            <Stack mt={1.5} direction="row" display="flex" alignItems="center">
              <Text>Priority</Text>
              <PriorityForm
                onChangePriority={(priority) =>
                  onEditTask({ ...task, priority: priority })
                }
                selectedPriority={selectedPriority}
              />
            </Stack>
            <Stack mt={1.5}>
              <Text>Description</Text>
              <Textarea
                value={inputValue || ""}
                onChange={(e) => handleChangeDescription(e.target.value)}
                placeholder="Here is a example description"
              />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <DuplicateTaskModal
        onDuplicateTask={(task) => onDuplicateTask(task)}
        task={task}
        isOpen={duplicateTaskModal.isOpen}
        onClose={duplicateTaskModal.onClose}
      />
    </>
  );
};

export default TaskDetails;
