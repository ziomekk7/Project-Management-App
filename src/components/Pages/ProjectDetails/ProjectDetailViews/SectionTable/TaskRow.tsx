import {
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Task } from "../../../../../types/types";
import { FC, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import PriorityForm from "../../PriorityForm/PriorityForm";
import TaskDetails from "./TaskDetails";
import DatePicker from "./DatePicker/DatePicker";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce} from "use-debounce";
import { EllipsisHorizontal } from "../../../../UI/icons";

type TaskRowProps = {
  actuallyDeletingTasks: string[];
  onDeleteTask: (taskId: string) => void;
  task: Task;
  onEditTask: (task: Task) => void;
  onDuplicateTask: (task: Task) => void;
};

const createTaskFormSchema = z.object({
  newTaskName: z
    .string()
    .min(1, { message: "Name must contain at least 2 character(s)" }),
});

const TaskRow: FC<TaskRowProps> = ({
  actuallyDeletingTasks,
  onDeleteTask,
  task,
  onEditTask,
  onDuplicateTask,
}) => {
  const [selectedDate, setSelectedDate] = useState(task.date);
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [isLoadingPriority, setIsLoadingPriority] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const taskDetailsDrawer = useDisclosure();
  const [debouncedValue] = useDebounce(taskName, 200);
  useEffect(() => {
    onEditTask({
      name: debouncedValue,
      id: task.id,
      date: task.date,
      priority: task.priority,
      description: task.description,
    });
  }, [debouncedValue]);

  useEffect(() => {
    return () => {
      setIsLoadingDate(false);
      setIsLoadingPriority(false);
    };
  }, [task]);

  const { register, handleSubmit } = useForm<
    z.infer<typeof createTaskFormSchema>
  >({
    resolver: zodResolver(createTaskFormSchema),
  });

  const handleChangeTask = (editedTask: Task) => {
    if (editedTask.date === task.date) {
      onEditTask(editedTask);
      return;
    }

    setSelectedDate(editedTask.date);
    onEditTask(editedTask);
  };
  const handleCheckDeletingTaskStatus = () => {
    const deletingTaskStatus = actuallyDeletingTasks.includes(task.id);
    return deletingTaskStatus;
  };

  return (
    <>
      <Grid
        h={16}
        templateColumns="2fr 1fr 1fr "
        borderBottom="1px solid black"
      >
        <GridItem
          p={2}
          ml={10}
          borderRight="1px solid black"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <form
            onSubmit={handleSubmit((data) => {
              onEditTask({
                name: data.newTaskName,
                id: task.id,
                date: task.date,
                priority: task.priority,
                description: task.description,
              });
            })}
          >
            <Input
              {...register("newTaskName")}
              onChange={(e) => setTaskName(e.target.value)}
              border="none"
              value={taskName}
            ></Input>
          </form>
          <Menu>
            <MenuButton
              ml={2.5}
              as={IconButton}
              icon={<EllipsisHorizontal />}
              isLoading={handleCheckDeletingTaskStatus()}
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                onClick={() => onDeleteTask(task.id)}
                icon={<DeleteIcon />}
              >
                Delete Task
              </MenuItem>
              <MenuItem
                onClick={taskDetailsDrawer.onOpen}
                icon={<ChevronRightIcon />}
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
            isLoadingDate={isLoadingDate}
            taskDate={task.date}
            selectedDate={selectedDate}
            onSelect={(date) => {
              setIsLoadingDate(true);
              handleChangeTask({
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
              setIsLoadingPriority(true);
              handleChangeTask({
                name: task.name,
                id: task.id,
                date: task.date,
                priority: priority,
                description: task.description,
              });
            }}
            selectedPriority={task.priority}
            isLoadingPriority={isLoadingPriority}
          />
        </GridItem>
      </Grid>
      <TaskDetails
        isLoadingPriority={isLoadingPriority}
        onClose={taskDetailsDrawer.onClose}
        isOpenMenu={taskDetailsDrawer.isOpen}
        isDeletingTask={handleCheckDeletingTaskStatus()}
        isLoadingDate={isLoadingDate}
        taskDate={task.date}
        selectedDate={selectedDate}
        onDuplicateTask={(task) => onDuplicateTask(task)}
        onChangeDate={(date) => {
          setIsLoadingDate(true);
          handleChangeTask({
            name: task.name,
            id: task.id,
            date: date,
            priority: task.priority,
            description: task.description,
          });
        }}
        onChangePriority={(priority) => {
          setIsLoadingPriority(true);
          handleChangeTask({
            name: task.name,
            id: task.id,
            date: task.date,
            priority: priority,
            description: task.description,
          });
        }}
        onChangeDescription={(description) =>
          handleChangeTask({
            name: task.name,
            id: task.id,
            date: task.date,
            priority: task.priority,
            description: description,
          })
        }
        onDeleteTask={(taskId) => onDeleteTask(taskId)}
        selectedPriority={task.priority}
        task={task}
      />
    </>
  );
};

export default TaskRow;
