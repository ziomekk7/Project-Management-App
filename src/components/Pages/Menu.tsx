import { Stack, Button, Heading, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { getProjects } from "../../api/projectsApi";
import { routes } from "../../routes";
import { Link } from "react-router-dom";

const Menu = () => {
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: getProjects,
  });

  if (projectsQuery.isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      bg="gray.700"
      h="100%"
      w="100%"
    >
      <Button variant="outline" maxW={36} p={1} leftIcon={<AddIcon />}>
        <Link to={routes.projects.create()}>Create Project</Link>
      </Button>
      {projectsQuery.data && projectsQuery.data.length === 0 && (
        <Text>No Projects</Text>
      )}

      {projectsQuery.data && projectsQuery.data.length > 0 && (
        <>
          <Heading as="h2" size="md">
            All Projects
          </Heading>

          {projectsQuery.data.map((project) => (
            <Button key={project.id} variant="ghost">
              <Link to={routes.projects.details({ projectId: project.id })}>
                {project.name}
              </Link>
            </Button>
          ))}
        </>
      )}
    </Stack>
  );
};

export default Menu;
