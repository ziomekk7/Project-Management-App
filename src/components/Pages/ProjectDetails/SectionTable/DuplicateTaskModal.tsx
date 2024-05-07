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
    resetField,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof duplicateTaskFormSchema>>({
    resolver: zodResolver(duplicateTaskFormSchema),
    defaultValues: { name: `Duplicated ${task.name}` },
  });

  const handleInnerSubmit = (data: z.infer<typeof duplicateTaskFormSchema>) => {
    onDuplicateTask({
      name: data.name,
      date: checkedFields.date ? task.date : null,
      priority: checkedFields.priority ? task.priority : TaskPriority.NONE,
      description: checkedFields.description ? task.description : null,
      id: uuidv4(),
    });
    onClose();
    resetField("name");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <form onSubmit={handleSubmit(handleInnerSubmit)}>
            <Input w="70%" {...register("name")}></Input>
            {errors.name?.message && <Text>{errors.name?.message}</Text>}
            <CheckboxGroup>
              <Stack>
                <Text>Include</Text>
                <Checkbox
                  isChecked={checkedFields.date}
                  onChange={(e) =>
                    setCheckedFields({
                      date: e.target.checked,
                      priority: checkedFields.priority,
                      description: checkedFields.description,
                    })
                  }
                >
                  Execution Date
                </Checkbox>
                <Checkbox
                  isChecked={checkedFields.priority}
                  onChange={(e) =>
                    setCheckedFields({
                      date: checkedFields.date,
                      priority: e.target.checked,
                      description: checkedFields.description,
                    })
                  }
                >
                  Priority
                </Checkbox>
                <Checkbox
                  isChecked={checkedFields.description}
                  onChange={(e) =>
                    setCheckedFields({
                      date: checkedFields.date,
                      priority: checkedFields.priority,
                      description: e.target.checked,
                    })
                  }
                >
                  Description
                </Checkbox>
                <Stack direction="row" justifyContent="space-around">
                  <Button type="submit" variant="outline">
                    Create duplicate task
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
