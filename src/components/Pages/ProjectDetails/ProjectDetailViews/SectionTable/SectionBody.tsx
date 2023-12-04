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
  isCreatingTask: boolean;
  onDuplicateTask: (task: Task) => void;
};

const SectionBody: React.FC<SectionBodyProps> = ({
  section,
  onCreateTask,
  onDeleteTask,
  onEditTask,
  actuallyDeletingTasks,
  isCreatingTask,
  onDuplicateTask,
}) => {
  return (
    <div>
      {section.tasks.map((task) => (
        <TaskRow
          onDuplicateTask={onDuplicateTask}
          key={task.id}
          task={task}
          onDeleteTask={onDeleteTask}
          actuallyDeletingTasks={actuallyDeletingTasks}
          onEditTask={(task) => onEditTask(task, section.id)}
        />
      ))}
      <CreateTaskRow
        onCreateTask={(task) => {
          onCreateTask(task);
        }}
        isCreatingTask={isCreatingTask}
      />
    </div>
  );
};

export default SectionBody;
