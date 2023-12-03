import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  Input,
  CheckboxGroup,
  Checkbox,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { Task } from "../../../../../types/types";
import { v4 as uuidv4 } from "uuid";
import { TaskPriority } from "../../../../../types/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const duplicateTaskFormSchema = z.object({
  duplicatedTaskNewName: z
    .string()
    .min(1, { message: "Name must contain at least 1 character(s)" }),
});

export type DuplicateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  duplicatedTask: (task: Task) => void;
};

const DuplicateTaskModal: FC<DuplicateTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  duplicatedTask,
}) => {
  const [checkedItems, setCheckedItems] = useState({
    date: false,
    priority: false,
    description: false,
  });

  const {
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof duplicateTaskFormSchema>>({
    resolver: zodResolver(duplicateTaskFormSchema),
    defaultValues: { duplicatedTaskNewName: `Duplicated ${task.name}` },
  });

  const handleDuplicateTask = (data: string) => {
    duplicatedTask({
      name: data,
      date: checkedItems.date ? task.date : null,
      priority: checkedItems.priority ? task.priority : TaskPriority.NONE,
      description: checkedItems.description ? task.description : null,
      id: uuidv4(),
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <form
            onSubmit={handleSubmit((data) => {
              handleDuplicateTask(data.duplicatedTaskNewName),
                onClose(),
                resetField("duplicatedTaskNewName");
            })}
          >
            <Input w="70%" {...register("duplicatedTaskNewName")}></Input>
            {errors.duplicatedTaskNewName?.message && (
              <Text>{errors.duplicatedTaskNewName?.message}</Text>
            )}
            <CheckboxGroup>
              <Stack>
                <Text>Include</Text>
                <Checkbox
                  isChecked={checkedItems.date}
                  onChange={(e) =>
                    setCheckedItems({
                      date: e.target.checked,
                      priority: checkedItems.priority,
                      description: checkedItems.description,
                    })
                  }
                  value="Execution Date"
                >
                  Execution Date
                </Checkbox>
                <Checkbox
                  isChecked={checkedItems.priority}
                  onChange={(e) =>
                    setCheckedItems({
                      date: checkedItems.date,
                      priority: e.target.checked,
                      description: checkedItems.description,
                    })
                  }
                  value="Priority"
                >
                  Priority
                </Checkbox>
                <Checkbox
                  isChecked={checkedItems.description}
                  onChange={(e) =>
                    setCheckedItems({
                      date: checkedItems.date,
                      priority: checkedItems.priority,
                      description: e.target.checked,
                    })
                  }
                  value="Description"
                >
                  Description
                </Checkbox>
                <Stack direction="row" justifyContent="space-around">
                  <Button type="submit" variant="outline">
                    Add duplicate task
                  </Button>
                  <Button mr={3} onClick={onClose} variant="outline">
                    Close
                  </Button>
                </Stack>
              </Stack>
            </CheckboxGroup>
          </form>
        </ModalHeader>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

export default DuplicateTaskModal;
