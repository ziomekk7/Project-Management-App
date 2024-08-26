import { Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Task } from "../../../../types/types";
import { FC, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

const createTaskFormSchema = z.object({
  newTaskName: z
    .string()
    .min(1, { message: "Name must contain at least 2 character(s)" }),
});

type EditNameInputProps = {
  task: Task;
  onEditTask: (task: Task) => void;
};

export const EditNameInput: FC<EditNameInputProps> = ({ task, onEditTask }) => {
  const [name, setName] = useState(task.name);
  const [debouncedValue] = useDebounce(name, 2000);

  useEffect(() => {
    if (debouncedValue === task.name) {
      return;
    }

    if (debouncedValue.trim() !== "") {
      onEditTask({
        name: debouncedValue,
        id: task.id,
        date: task.date,
        priority: task.priority,
        description: task.description,
      });
    }
  }, [debouncedValue, task, onEditTask]);

  const { register, handleSubmit } = useForm<
    z.infer<typeof createTaskFormSchema>
  >({
    resolver: zodResolver(createTaskFormSchema),
  });

  return (
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
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setName(e.target.value)}
        border="none"
        value={name}
        textOverflow="ellipsis"
      />
    </form>
  );
};
