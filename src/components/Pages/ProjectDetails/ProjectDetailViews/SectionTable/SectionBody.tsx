import TaskRow from "./TaskRow";
import CreateTaskRow from "./CreateTaskRow";
import { Section, Task } from "../../../../../types/types";

type SectionBodyProps = {
  section: Section;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task, sectionId: string) => void;
  onCreateTask: (task: Task) => void;
  actuallyDeletingTasks: string[];
  isCreateTaskPending: boolean;
  isAddingTask: boolean;
  hiddenSections: string[];
  duplicatedTask: (task: Task) => void;
};

const SectionBody: React.FC<SectionBodyProps> = ({
  section,
  onCreateTask,
  onDeleteTask,
  onEditTask,
  actuallyDeletingTasks,
  isAddingTask,
  hiddenSections,
  duplicatedTask,
}) => {
  return (
    <>
      {!hiddenSections.find((sectionId) => sectionId === section.id) ? (
        <div>
          {section.tasks.map((task) => (
            <TaskRow
              duplicatedTask={(task) => duplicatedTask(task)}
              key={task.id}
              task={task}
              onDeleteTask={(taskId) => onDeleteTask(taskId)}
              actuallyDeletingTasks={actuallyDeletingTasks}
              onEditTask={(task) => onEditTask(task, section.id)}
            />
          ))}
          <CreateTaskRow
            onCreateTask={(task) => {
              onCreateTask(task);
            }}
            isAddingTask={isAddingTask}
          />
        </div>
      ) : null}
    </>
  );
};

export default SectionBody;
