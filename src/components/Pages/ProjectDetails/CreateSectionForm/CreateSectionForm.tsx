import { Input, InputGroup, Text, useOutsideClick } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

const createSectionFormSchema = z.object({
  newSection: z
    .string()
    .min(5, { message: "Name must contain at least 5 character(s)" }),
});

type CreateSectionFormProps = {
  isCreatingSection: boolean;
  onClose: () => void;
  onCreateSection: (newSection: string) => void;
};
const CreateSectionForm: React.FC<CreateSectionFormProps> = (props) => {
  const createSectionFormRef = useRef(null);
  useOutsideClick({
    ref: createSectionFormRef,
    handler: () => props.onClose(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createSectionFormSchema>>({
    resolver: zodResolver(createSectionFormSchema),
  });

  return (
    <form
      ref={createSectionFormRef}
      onSubmit={handleSubmit((data) => {
        props.onCreateSection(data.newSection);
      })}
    >
      <InputGroup>
        <Input
          {...register("newSection")}
          isDisabled={props.isCreatingSection}
          placeholder="Create new section"
          autoFocus
        ></Input>
      </InputGroup>
      {errors.newSection?.message && <Text>{errors.newSection?.message}</Text>}
    </form>
  );
};

export default CreateSectionForm;
