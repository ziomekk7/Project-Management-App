import { Flex } from "@chakra-ui/react";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import { FC } from "react";
import { Task } from "../../../../types/types";

type CreateTaskRowProps = {
  onCreateTask: (task: Task) => void;
};

const CreateTaskRow: FC<CreateTaskRowProps> = ({
  onCreateTask,
}) => {
  return (
    <Flex p={5} w="100%">
      <CreateTaskForm
        setAutoFocus={false}
        onCreateTask={(task) => onCreateTask(task)}
      />
    </Flex>
  );
};

export default CreateTaskRow;
