import React, { useState } from "react";
import { Task } from "../../../../../../types/types";
import { Box, Card, CardBody, Stack } from "@chakra-ui/react";
import { EditNameInput } from "../../EditNameInput";
import PriorityForm from "../../../PriorityForm/PriorityForm";
import DatePicker from "../../../SectionTable/DatePicker/DatePicker";
import { TaskPriority } from "../../../../../../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "High",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.LOW]: "Low",
  [TaskPriority.NONE]: "---",
};

type TaskCardBoardProps = {
  sectionId: string;
  task: Task;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  onEditTask: (task: Task) => void;
};

const TaskCardBoard: React.FC<TaskCardBoardProps> = ({
  task,
  sectionId,
  onOpenTaskDetails,
  onEditTask,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "transform 300ms ease",
  };
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  return (
    <Box
      w={64}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={task.id.toString()}
      onClick={() => onOpenTaskDetails(task.id, sectionId)}
    >
      <Card border="1px" mb={2} borderColor="gray.600">
        <CardBody>
          <EditNameInput task={task} onEditTask={onEditTask} />
          <Stack>
            <PriorityForm
              onChangePriority={(priority) => {
                onEditTask({
                  ...task,
                  priority: priority,
                });
              }}
              selectedPriority={task.priority}
            />
            {PRIORITY_LABELS[task.priority]}
            <DatePicker
              taskDate={task.date}
              selectedDate={selectedDate ? selectedDate : null}
              onSelect={(date) => {
                setSelectedDate(date);
                onEditTask({
                  ...task,
                  date: date,
                });
              }}
            />
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TaskCardBoard;
