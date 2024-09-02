import { Stack, Button, Text, Image, Divider } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { getProjects } from "../../api/projectsApi";
import { routes } from "../../routes";
import { Link, useLocation } from "react-router-dom";
import homeIcon from "../../images/icons/home.svg";

type MenuProps = {
  onClose?: () => void;
};

const Menu: React.FC<MenuProps> = ({ onClose }) => {
  const location = useLocation();
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: getProjects,
  });

  return (
    <Stack
      position="sticky"
      top={0}
      direction="column"
      alignItems="center"
      bg="gray.700"
      h="100%"
      w="100%"
      gap={0}
    >
      <Button
        w="90%"
        justifyContent="left"
        mt={2}
        variant={location.pathname === routes.home() ? "solid" : "ghost"}
        p={3}
      >
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
          to={routes.home()}
        >
          <Image mr={2} src={homeIcon} alt="Home icon" boxSize="20px" />
          Home
        </Link>
      </Button>
      <Button
        justifyContent="left"
        w="90%"
        mb={2}
        variant={
          location.pathname === routes.projects.create() ? "solid" : "ghost"
        }
        p={3}
      >
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
          to={routes.projects.create()}
        >
          <AddIcon mr={2} />
          Create Project
        </Link>
      </Button>
      {projectsQuery.data && projectsQuery.data.length === 0 && (
        <Text>No Projects</Text>
      )}

      {projectsQuery.data && projectsQuery.data.length > 0 && (
        <>
          <Divider mb={2} />
          <Stack w="100%" gap={0} p={2}>
            <Text p={2}>Projects</Text>

            {projectsQuery.data.map((project) => (
              <Button
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                size="xs"
                fontWeight="semibold"
                w="90%"
                onClick={onClose}
                key={project.id}
                variant={
                  location.pathname ===
                  routes.projects.details({ projectId: project.id })
                    ? "solid"
                    : "ghost"
                }
              >
                <Link
                  to={routes.projects.details({ projectId: project.id })}
                  style={{
                    alignItems: "center",
                    width: "100%",
                    textOverflow: "ellipsis",
                    textAlign: "left",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.name}
                </Link>
              </Button>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Menu;
