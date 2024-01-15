import {
  Stack,
  Card,
  CardBody,
  Box,
  Heading,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
} from "@chakra-ui/react";
import { Project, Task } from "../../../../types/types";
import { TaskPriority } from "../../../../types/types";
import { EllipsisHorizontal } from "../../../UI/Icons/EllipsisHorizontal";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import DatePicker from "./SectionTable/DatePicker/DatePicker";
import PriorityForm from "../PriorityForm/PriorityForm";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { CreateTaskCard } from "./CreateTaskCard/CreateTaskCard";
import { useState } from "react";
import { EditNameInput } from "./EditNameInput";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "High",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.LOW]: "Low",
  [TaskPriority.NONE]: "---",
};

type ProjectDetailBoardView = {
  isCreatingSection: boolean;
  project: Project | null | undefined;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  isCreateSectionFormVisible: boolean;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  onEditTask: (task: Task) => void;
};

type SectionMenuProps = {
  onDeleteSection: () => void;
};

const SectionMenu: React.FC<SectionMenuProps> = ({ onDeleteSection }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<EllipsisHorizontal />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem onClick={onDeleteSection} icon={<DeleteIcon />}>
          Delete Section
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const ProjectDetailBoardView: React.FC<ProjectDetailBoardView> = ({
  isCreatingSection,
  project,
  onOpenTaskDetails,
  isCreateSectionFormVisible,
  onCreateSection,
  onDeleteSection,
  onCreateTask,
  onOpenCreateSectionForm,
  onCloseCreateSectionForm,
  onEditTask,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>();

  return (
    <>
      <Stack direction="row" overflow="auto" h="85%">
        {project &&
          project.sections.map((section) => (
            <Stack
              mr={1}
              ml={1}
              maxW={72}
              minW={60}
              key={section.id}
              className="test2"
            >
              <Card variant="outline" h="100%" w={64} p={1}>
                <Stack direction="row" alignItems="center">
                  <Heading size="md" p={3}>
                    {section.name}
                  </Heading>
                  <SectionMenu
                    onDeleteSection={() => onDeleteSection(section.id)}
                  />
                </Stack>
                {section.tasks.length === 0 ? (
                  <Card
                    mb={2}
                    h="100%"
                    minH={80}
                    bgGradient="linear(to-b, gray.700, gray.800)"
                  >
                    <CardBody>
                      <CreateTaskCard
                        onCreateTask={(task) => onCreateTask(task, section.id)}
                      />
                    </CardBody>
                  </Card>
                ) : (
                  <Box overflow="auto">
                    {section.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onOpenTaskDetails(task.id, section.id)}
                      >
                        <Card border="1px" mb={2} borderColor="gray.600">
                          <CardBody>
                            <EditNameInput
                              task={task}
                              onEditTask={onEditTask}
                            />
                            <Stack>
                              <PriorityForm
                                onChangePriority={(priority) => {
                                  onEditTask({
                                    ...task,
                                    priority: priority,
                                  });
                                }}
                                selectedPriority={task.priority}
                              />
                              {PRIORITY_LABELS[task.priority]}
                              <DatePicker
                                taskDate={task.date}
                                selectedDate={
                                  selectedDate ? selectedDate : null
                                }
                                onSelect={(date) => {
                                  setSelectedDate(date);
                                  onEditTask({
                                    ...task,
                                    date: date,
                                  });
                                }}
                              />
                            </Stack>
                          </CardBody>
                        </Card>
                      </div>
                    ))}
                    <Card bg="transparent" mt={1} h={40}>
                      <CardBody>
                        <CreateTaskCard
                          onCreateTask={(task) =>
                            onCreateTask(task, section.id)
                          }
                        />
                      </CardBody>
                    </Card>
                  </Box>
                )}
              </Card>
            </Stack>
          ))}
        <Card variant="outline" minH="100%" w={60} minW={60} p={1} ml={1}>
          <Stack direction="row" justify="center" mb={2}>
            {isCreateSectionFormVisible ? (
              <CreateSectionForm
                isCreatingSection={isCreatingSection}
                onClose={() => onCloseCreateSectionForm()}
                onCreateSection={(name) => onCreateSection(name)}
              />
            ) : !isCreatingSection ? (
              <Button
                leftIcon={<AddIcon />}
                w="100%"
                variant="outline"
                onClick={() => onOpenCreateSectionForm()}
              >
                Create Section
              </Button>
            ) : null}
          </Stack>
          <Card
            mb={2}
            h="100%"
            bgGradient="linear(to-b, gray.700, gray.800)"
          ></Card>
        </Card>
      </Stack>
    </>
  );
};

export default ProjectDetailBoardView;
