import {
  Stack,
  Text,
  Card,
  CardBody,
  Box,
  Heading,
  Button,
  useOutsideClick,
} from "@chakra-ui/react";
import { Project, Task } from "../../../../types/types";
import { PRIORITY_COLORS } from "../../../../config";
import { TaskPriority } from "../../../../types/types";
import { format } from "date-fns";
import { useRef, useState } from "react";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "High",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.LOW]: "Low",
  [TaskPriority.NONE]: "---",
};

type ProjectDetailBoardView = {
  project: Project;
  onCreateTask:(sectionId:string, task:Task)=>void;
  isCreatingTask: boolean;
};

const ProjectDetailBoardView: React.FC<ProjectDetailBoardView> = ({
  project, onCreateTask, isCreatingTask
}) => {
  const [onHideCreateTaskForm, setOnHideCreateTaskForm] = useState<
    string | null
  >(null);
  const createTaskRef = useRef(null);
  useOutsideClick({
    ref: createTaskRef,
    handler: () => setOnHideCreateTaskForm(null),
  });
  return (
    <Stack direction="row" overflow="auto" h="85%">
      {project.sections.map((section) => (
        <Stack
          mr={1}
          ml={1}
          maxW={72}
          minW={60}
          key={section.id}
          className="test2"
        >
          <Card variant="outline" h="100%">
            <Heading size="md" p={3}>
              {section.name}
            </Heading>
            {section.tasks.length === 0 ? (
              <Card>
                <Button>Create Task</Button>
              </Card>
            ) : (
              <Box overflow="auto">
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
                {onHideCreateTaskForm === section.id ? (
                  <Card
                    ref={createTaskRef}
                    border="1px"
                    h={24}
                    mt={2}
                    borderColor="gray.600"
                    justifyContent="center"
                  >
                    <CreateTaskForm
                      onCreateTask={(task) => {onCreateTask(section.id, task), setOnHideCreateTaskForm(null)}}
                      isCreatingTask={isCreatingTask}
                      setAutoFocus={true}
                    />
                  </Card>
                ) : (
                  <Button onClick={() => setOnHideCreateTaskForm(section.id)}>
                    Create Task
                  </Button>
                )}
              </Box>
            )}
          </Card>
        </Stack>
      ))}
    </Stack>
  );
};

export default ProjectDetailBoardView;
