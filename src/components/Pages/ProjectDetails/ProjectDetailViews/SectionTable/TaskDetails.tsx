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
  onChangePriority: (priority: TaskPriority) => void;
  onChangeDescription: (description: string | null) => void;
  selectedPriority: TaskPriority;
  isLoadingDate: boolean;
  isLoadingPriority: boolean;
  taskDate: Date | null;
  selectedDate: Date | null;
  onChangeDate: (selectedDate: Date) => void;
  onDeleteTask: (taskId: string) => void;
  isDeletingTask: boolean;
  isOpenMenu: boolean;
  onClose: () => void;
  onDuplicateTask: (task: Task) => void;
};
const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onChangePriority,
  selectedPriority,
  isLoadingDate,
  taskDate,
  selectedDate,
  onChangeDate,
  onChangeDescription,
  onDeleteTask,
  isDeletingTask,
  isOpenMenu,
  onClose,
  onDuplicateTask,
  isLoadingPriority,
}) => {
  const duplicateTaskModal = useDisclosure();
  const [inputValue, setInputValue] = useState(task.description);
  const [debouncedValue] = useDebounce(inputValue, 200);
  useEffect(() => {
    onChangeDescription(debouncedValue);
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
                  // TODO isLoading = actuallyDeletingTasks ???
                  isLoading={isDeletingTask}
                  variant="ghost"
                  ml={2.5}
                />
                <MenuList>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => onDeleteTask(task.id)}
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
                isLoadingDate={isLoadingDate}
                taskDate={taskDate}
                selectedDate={selectedDate}
                onSelect={(selectedDate) => onChangeDate(selectedDate)}
              />
            </Stack>
            <Stack mt={1.5} direction="row" display="flex" alignItems="center">
              <Text>Priority</Text>
              <PriorityForm
                isLoadingPriority={isLoadingPriority}
                onChangePriority={onChangePriority}
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
