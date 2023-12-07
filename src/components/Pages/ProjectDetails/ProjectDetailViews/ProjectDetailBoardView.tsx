import {
  Stack,
  Text,
  Card,
  // CardHeader,
  CardBody,
  // CardFooter,
  Box,
  Heading,
  Button,
} from "@chakra-ui/react";
// import ProjectHeader from "./ProjectHeader/ProjectHeader"
import { Project } from "../../../../types/types";
import { PRIORITY_COLORS } from "../../../../config";
import { TaskPriority } from "../../../../types/types";
import { format } from "date-fns";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "High",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.LOW]: "Low",
  [TaskPriority.NONE]: "---",
};

type ProjectDetailBoardView = {
  project: Project;
};

const ProjectDetailBoardView: React.FC<ProjectDetailBoardView> = ({
  project,
}) => {
  return (
    <Stack direction="row" overflow="auto" h="85%">
      {project.sections.map((section) => (
        <Stack mr={1} ml={1} maxW={72} minW={60} key={section.id} className="test2">
          <Card variant="outline" h="100%">
            <Heading size="md" p={3}>{section.name}</Heading>
            {section.tasks.length === 0 ? (
              <Card>
                <Button>Create Task</Button>
              </Card>
            ) : (
              <Box overflow="auto" >
                {section.tasks.map((task) => (
                  <Card
                    key={task.id}
                    border="1px"
                    mb={2}
                    borderColor="gray.600"
                  >
                    <CardBody>
                      <Text mb={2} size="md">
                        {task.name}
                      </Text>
                      <Stack>
                        <Button
                          mb={2}
                          size="xs"
                          maxW={20}
                          bg={PRIORITY_COLORS[task.priority]}
                          variant="outline"
                        >
                          {PRIORITY_LABELS[task.priority]}
                        </Button>
                        <Button
                          mb={2}
                          size="xs"
                          maxW={20}
                          bg="transparent"
                          variant="outline"
                        >
                          {task.date ? format(task.date, "d/L/yyyy") : "---"}
                        </Button>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            )}
          </Card>
        </Stack>
      ))}
    </Stack>
  );
};

export default ProjectDetailBoardView;
