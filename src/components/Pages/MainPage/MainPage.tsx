import { Button, Card, Container, Image, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { queryKeys } from "../../../queryKeys";
import { getProjects } from "../../../api/projectsApi";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { routes } from "../../../routes";
import projectIcon from "../../../images/project.png";

export const MainPage = () => {
  const projectsQuery = useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: getProjects,
  });

  const now = new Date();
  const currentHour = now.getHours();
  const handleWelcome = () => {
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else return "Good Evening";
  };
  return (
    <Container maxW="container.lg">
      <Stack>
        <Stack>
          <Text fontSize="xl" fontWeight="medium" m={2}>
            Home
          </Text>
        </Stack>
        <Stack alignItems="center" w="100%" p={2} fontWeight="medium">
          <Text>{format(now, "EEEE, d MMMM", { locale: enUS })}</Text>
          <Text fontSize="4xl">{handleWelcome()} Visitor</Text>
        </Stack>
        <Stack alignItems="center">
          <Card
            border="1px"
            borderColor="gray.700"
            backgroundColor="#1e2533"
            p={5}
            m={5}
            minW={60}
            maxW={96}
            minH={60}
          >
            <Stack>
              <Button
                backgroundColor="none"
                justifyContent="left"
                color="gray.600"
                colorScheme="transparent"
                _hover={{
                  color: "white",
                  bg: "gray.700",
                  "& *": { color: "white" },
                }}
                mb={2}
                p={1}
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
                  <Stack
                    flex="row"
                    alignItems="center"
                    justifyContent="center"
                    border="2px dashed "
                    borderRadius="14px"
                    w={10}
                    h={10}
                    mr={2}
                  >
                    <AddIcon />
                  </Stack>
                  Create Project
                </Link>
              </Button>
              {projectsQuery.data?.map((project) => (
                <Button
                  key={project.id}
                  justifyContent="left"
                  variant="ghost"
                  _hover={{
                    color: "white",
                    bg: "gray.700",
                    "& *": { color: "white" },
                  }}
                  mb={2}
                  p={1}
                  w="100%" 
                >
                  <Link
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                    to={routes.projects.details({ projectId: project.id })}
                  >
                    <Image w={9} h={9} mr={2} p={1} src={projectIcon} />
                    <Text
                      isTruncated
                      maxWidth="80%" 
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                    >
                      {project.name}
                    </Text>
                  </Link>
                </Button>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
};
