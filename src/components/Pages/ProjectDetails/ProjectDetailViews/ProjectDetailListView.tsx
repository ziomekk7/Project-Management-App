import { Box, Button, Stack } from "@chakra-ui/react";
import CreateSectionForm from "../CreateSectionForm/CreateSectionForm";
import { Project, Task } from "../../../../types/types";
import SectionHeader from "./SectionTable/SectionHeader";
import ExampleTaskRow from "./SectionTable/ExampleTaskRow";
import TaskRow from "./SectionTable/TaskRow";
import CreateTaskRow from "./SectionTable/CreateTaskRow";
import { AddIcon } from "@chakra-ui/icons";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../StrictModrDroppable";

type ProjectDetailListViewProps = {
  onEditTask: (task: Task) => void;
  isCreatingSection: boolean;
  project: Project | null | undefined;
  onOpenTaskDetails: (taskId: string, sectionId: string) => void;
  isCreateSectionFormVisible: boolean;
  onCreateSection: (name: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onCreateTask: (task: Task, sectionId: string) => void;
  onOpenCreateSectionForm: () => void;
  onCloseCreateSectionForm: () => void;
  onDeleteTask: (taskId: string) => void;
  hiddenSections: string[];
  onHideSectionId: (sectionId: string) => void;
  onDuplicateTask: (task: Task, sectionId: string) => void;
  onChangeObjectLocation: (results:DropResult) => void;
};

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({
  hiddenSections,
  onDeleteTask,
  onHideSectionId,
  onDuplicateTask,
  project,
  onDeleteSection,
  onOpenTaskDetails,
  onEditTask,
  isCreateSectionFormVisible,
  onCreateTask,
  isCreatingSection,
  onCloseCreateSectionForm,
  onCreateSection,
  onOpenCreateSectionForm,
  onChangeObjectLocation,
}) => {
  return (
    <Stack overflow="auto" h="85%">
      <ExampleTaskRow />
      <DragDropContext onDragEnd={(results)=> onChangeObjectLocation(results)}>
        {project ? (
          <StrictModeDroppable droppableId={project.id} type="section">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {project.sections.map((section, index) => (
                  <Draggable
                    index={index}
                    key={section.id}
                    draggableId={section.id}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <SectionHeader
                          section={section}
                          onDeleteSection={() => onDeleteSection(section.id)}
                          onToggleHideSection={() =>
                            onHideSectionId(section.id)
                          }
                          hiddenSections={hiddenSections}
                        />

                        {!hiddenSections.some(
                          (sectionId) => sectionId === section.id
                        ) && (
                          <div>
                            <StrictModeDroppable
                              droppableId={section.id}
                              type="task"
                            >
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {section.tasks.map((task, index) => (
                                    <Draggable
                                      index={index}
                                      key={task.id}
                                      draggableId={task.id}
                                    >
                                      {(provided) => (
                                        <div
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          ref={provided.innerRef}
                                        >
                                          <TaskRow
                                            onChangeDate={(task) =>
                                              onEditTask(task)
                                            }
                                            onChangePriority={(task) =>
                                              onEditTask(task)
                                            }
                                            onOpenTaskDetails={(task) =>
                                              onOpenTaskDetails(
                                                task,
                                                section.id
                                              )
                                            }
                                            onDuplicateTask={(task) =>
                                              onDuplicateTask(task, section.id)
                                            }
                                            key={task.id}
                                            task={task}
                                            onDeleteTask={onDeleteTask}
                                            onEditTask={onEditTask}
                                            sectionId={section.id}
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </StrictModeDroppable>
                            <CreateTaskRow
                              onCreateTask={(task) => {
                                onCreateTask(task, section.id);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        ) : null}
      </DragDropContext>

      <Stack p={4} w="md">
        {isCreateSectionFormVisible ? (
          <CreateSectionForm
            isCreatingSection={isCreatingSection}
            onClose={() => onCloseCreateSectionForm()}
            onCreateSection={(name) => onCreateSection(name)}
          />
        ) : !isCreatingSection ? (
          <Box>
            <Button
              leftIcon={<AddIcon />}
              variant="outline"
              onClick={() => onOpenCreateSectionForm()}
            >
              Create Section
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default ProjectDetailListView;
