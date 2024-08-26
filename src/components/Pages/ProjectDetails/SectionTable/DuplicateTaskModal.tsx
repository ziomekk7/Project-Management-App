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
  ModalBody,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Task, TaskPriority } from "../../../../types/types";

const duplicateTaskFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must contain at least 1 character(s)" }),
});

export type DuplicateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onDuplicateTask: (task: Task) => void;
};

const DuplicateTaskModal: FC<DuplicateTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onDuplicateTask,
}) => {
  const [checkedFields, setCheckedFields] = useState({
    date: false,
    priority: false,
    description: false,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof duplicateTaskFormSchema>>({
    resolver: zodResolver(duplicateTaskFormSchema),
    defaultValues: { name: `Duplicated ${task.name}` },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: `Duplicated ${task.name}` });
    }
  }, [isOpen, reset, task.name]);

  const handleInnerSubmit = (data: z.infer<typeof duplicateTaskFormSchema>) => {
    onDuplicateTask({
      name: data.name,
      date: checkedFields.date ? task.date : null,
      priority: checkedFields.priority ? task.priority : TaskPriority.NONE,
      description: checkedFields.description ? task.description : null,
      id: uuidv4(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Duplicate Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleInnerSubmit)}>
            <Stack spacing={4}>
              <Input w="70%" {...register("name")} placeholder="Task Name" />
              {errors.name?.message && (
                <Text color="red.500">{errors.name?.message}</Text>
              )}
              <CheckboxGroup>
                <Stack spacing={3}>
                  <Text>Include</Text>
                  <Checkbox
                    isChecked={checkedFields.date}
                    onChange={(e) =>
                      setCheckedFields({
                        ...checkedFields,
                        date: e.target.checked,
                      })
                    }
                  >
                    Execution Date
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedFields.priority}
                    onChange={(e) =>
                      setCheckedFields({
                        ...checkedFields,
                        priority: e.target.checked,
                      })
                    }
                  >
                    Priority
                  </Checkbox>
                  <Checkbox
                    isChecked={checkedFields.description}
                    onChange={(e) =>
                      setCheckedFields({
                        ...checkedFields,
                        description: e.target.checked,
                      })
                    }
                  >
                    Description
                  </Checkbox>
                </Stack>
              </CheckboxGroup>
              <Stack direction="row" justifyContent="space-between">
                <Button type="submit" colorScheme="blue">
                  Create Duplicate Task
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </Stack>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DuplicateTaskModal;
