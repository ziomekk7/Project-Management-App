import TaskRow from './TaskRow'
import CreateTaskRow from './CreateTaskRow'
import { Section, Task } from '../../../../../types/types'

type SectionBodyProps = {
	section: Section
	onDeleteTask: (taskId: string) => void
	onEditTask: (task: Task, sectionId: string) => void
	onCreateTask: (newTask: string) => void
	actuallyDeletingTasks: string[]
	isCreateTaskPending: boolean
	isAddingTask: boolean
	isHidenSections: string[]
}

const SectionBody: React.FC<SectionBodyProps> = ({
	section,
	onCreateTask,
	onDeleteTask,
	onEditTask,
	actuallyDeletingTasks,
	isCreateTaskPending,
	isAddingTask,
	isHidenSections,
}) => {
	
	return (
		<>
			{!isHidenSections.find(sectionId => sectionId === section.id) ? (
				<div>
					{section.tasks.map(task => (
						<TaskRow
							key={task.id}
							task={task}
							onDeleteTask={taskId => onDeleteTask(taskId)}
							actuallyDeletingTasks={actuallyDeletingTasks}
							onEditTask={task => onEditTask(task, section.id)}
						/>
					))}
					<CreateTaskRow
						onCreateTask={newTask => {
							onCreateTask(newTask)
						}}
						createTaskIsPending={isCreateTaskPending}
						isAddingTask={isAddingTask}
					/>
				</div>
			) : null}
		</>
	)
}

export default SectionBody
