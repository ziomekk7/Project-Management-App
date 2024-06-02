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
} from "@chakra-ui/react";
import {
  CheckIcon,
  DeleteIcon,
  Search2Icon,
  UpDownIcon,
} from "@chakra-ui/icons";
import { Section, Task } from "../../../../types/types";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import PriorityForm from "../PriorityForm/PriorityForm";
import DatePicker from "./DatePicker/DatePicker";
import { EllipsisHorizontal } from "../../../UI/Icons/EllipsisHorizontal";
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
}) => {
  const [selectedDate, setSelectedDate] = useState(task.date);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });
  const deleteTaskModal = useDisclosure();
  const hideOnSmallResolutions = useBreakpointValue({
    base: { display: "none", templateColumns: "1fr" },
    md: { display: "flex", templateColumns: "2fr 1fr 1fr" },
    lg: { display: "flex", templateColumns: "2fr 1fr 1fr" },
  });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
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
      h={16}
      templateColumns={hideOnSmallResolutions?.templateColumns}
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
        <Flex>
          <Menu>
            <MenuButton
              ml={2.5}
              as={IconButton}
              icon={<UpDownIcon />}
              variant="ghost"
            />
            <MenuList>
              <MenuGroup title="Move task to section">
                {sections.map((section) => (
                  <MenuItem
                    key={section.id}
                    onClick={() => handleChangeTaskLocation(section.id)}
                  >
                    <Flex w="100%">
                      {section.id == sectionId ? <CheckIcon /> : null}
                      {section.id == sectionId ? (
                        <Text ml="0">{section.name}</Text>
                      ) : (
                        <Text ml="16px">{section.name}</Text>
                      )}
                    </Flex>
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              ml={2.5}
              as={IconButton}
              icon={<EllipsisHorizontal />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={deleteTaskModal.onOpen} icon={<DeleteIcon />}>
                Delete Task
              </MenuItem>
              <MenuItem
                onClick={() => onOpenTaskDetails(task.id)}
                icon={<Search2Icon />}
              >
                Task Details
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
      <GridItem
        borderRight="1px solid black"
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
        borderRight="1px solid black"
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
