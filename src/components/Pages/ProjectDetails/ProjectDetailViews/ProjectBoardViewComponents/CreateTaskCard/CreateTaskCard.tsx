import { Card, Button, useOutsideClick } from "@chakra-ui/react";
import CreateTaskForm from "../../../CreateTaskForm/CreateTaskForm";
import { Task } from "../../../../../../types/types";
import { useState, useRef } from "react";

type CreateTaskCardProps = {
  onCreateTask: (task: Task) => void;
  sectionId:string
};

export const CreateTaskCard: React.FC<CreateTaskCardProps> = ({
  onCreateTask
}) => {
  const [isHideCreateTaskForm, setIsHideCreateTaskForm] = useState(false);
  const createTaskRef = useRef(null);
  useOutsideClick({
    ref: createTaskRef,
    handler: () => setIsHideCreateTaskForm(false),
  });
  return (
    <Card ref={createTaskRef}>
      {isHideCreateTaskForm ? (
        <CreateTaskForm
          onCreateTask={(task) => {
            onCreateTask(task);
            setIsHideCreateTaskForm(false);
          }}
          setAutoFocus={true}
        />
      ) : (
        <Button onClick={() => setIsHideCreateTaskForm(true)}>
          Create Task
        </Button>
      )}
    </Card>
  );
};
