import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Container,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "../../../api/projectsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routes } from "../../../routes";
import { queryKeys } from "../../../queryKeys";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import RootLayout from "../../Roots/RootLayout";

const createProjectFormSchema = z.object({
  newProject: z
    .string()
    .min(5, { message: "Name must contain at least 5 character(s)" }),
});

const CreatingProject = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      navigate(routes.projects.details({ projectId }));
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createProjectFormSchema>>({
    resolver: zodResolver(createProjectFormSchema),
    disabled: createProjectMutation.isPending,
  });

  const handleCreateProject = (newProject: string) => {
    const projectId = uuidv4();
    createProjectMutation.mutate({ newProject, projectId });
  };

  return (
    <RootLayout>
      <Container>
        <form
          onSubmit={handleSubmit((data) => {
            handleCreateProject(data.newProject);
          })}
        >
          <FormControl>
            <Flex direction="column" align="center">
              <FormLabel htmlFor="newProject">New Project</FormLabel>
              <Input
                {...register("newProject")}
                id="newProject"
                placeholder="My first project"
                autoFocus
              />

              <Flex direction="row" justify="space-between" m={2}>
                <Button
                  isLoading={createProjectMutation.isPending}
                  type="submit"
                  m={1}
                >
                  Create
                </Button>
                <Button
                  isDisabled={createProjectMutation.isPending}
                  as={Link}
                  to={routes.home()}
                  m={1}
                >
                  Cancel
                </Button>
              </Flex>
            </Flex>
          </FormControl>
          {errors.newProject?.message && (
            <Text>{errors.newProject?.message}</Text>
          )}
        </form>
      </Container>
    </RootLayout>
  );
};

export default CreatingProject;
