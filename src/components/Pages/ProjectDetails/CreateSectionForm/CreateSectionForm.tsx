import {
  Input,
  InputGroup,
  InputRightAddon,
  Button,
  ButtonGroup,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createSectionFormSchema>>({
    resolver: zodResolver(createSectionFormSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        props.onCreateSection(data.newSection);
      })}
    >
      <InputGroup>
        <Input
          {...register("newSection")}
          isDisabled={props.isCreatingSection}
          placeholder="Name of new section"
          autoFocus
        ></Input>
        <InputRightAddon>
          <ButtonGroup isAttached variant="outline">
            <Button type="submit" size="md" variant="ghost" >
              Create
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                props.onClose();
              }}
              size="md"
            >
              Cancel
            </Button>
          </ButtonGroup>
        </InputRightAddon>
      </InputGroup>
      {errors.newSection?.message && <Text>{errors.newSection?.message}</Text>}
    </form>
  );
};

export default CreateSectionForm;
