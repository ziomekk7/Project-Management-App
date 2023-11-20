import { Button, Stack } from '@chakra-ui/react'
import CreateSectionForm from '../CreateSectionForm/CreateSectionForm'
import { Project, Task } from '../../../../types/types'
import SectionHeader from './SectionTable/SectionHeader'
import SectionBody from './SectionTable/SectionBody'
import ExampleTaskRow from './SectionTable/ExampleTaskRow'

type ProjectDetailListViewProps = {
	project: Project
	actuallyDeletingTasks: string[]
	isCreateTaskPending: boolean
	isCreateSectionPending: boolean
	isCreateSectionFormVisible: boolean
	isHidenSections: string[]
	isAddingTask: boolean
	onCreateSection: (name: string) => void
	onDeleteSection: (sectionId: string) => void
	onEditTask: (task: Task, sectionId: string) => void
	onDeleteTask: (sectionId: string, taskId: string) => void
	onCreateTask: (sectionId: string, newTask: string) => void
	onHideSectionId: (sectionId: string) => void
	onOpenCreateSectionForm: () => void
	onCloseCreateSectionForm: () => void
	actuallyDeletingSections:string[]
}

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({
	project,
	isCreateTaskPending,
	isCreateSectionPending,
	isCreateSectionFormVisible,
	isHidenSections,
	actuallyDeletingTasks,
	onCreateSection,
	onDeleteSection,
	onDeleteTask,
	onCreateTask,
	onEditTask,
	onHideSectionId,
	onOpenCreateSectionForm,
	onCloseCreateSectionForm,
	isAddingTask,
	actuallyDeletingSections
}) => {
	return (
		<>
			<ExampleTaskRow />
			{project.sections.map(section => (
				<div key={section.id}>
					<SectionHeader
					actuallyDeletingSections={actuallyDeletingSections}
						section={section}
						onDeleteSection={() => onDeleteSection(section.id)}
						onToggleHideSection={() => onHideSectionId(section.id)}
						isHidenSections={isHidenSections}
					/>
					<SectionBody
						section={section}
						onDeleteTask={taskId => onDeleteTask(section.id, taskId)}
						actuallyDeletingTasks={actuallyDeletingTasks}
						onEditTask={task => onEditTask(task, section.id)}
						onCreateTask={newTask => {
							onCreateTask(section.id, newTask)
						}}
						isCreateTaskPending={isCreateTaskPending}
						isAddingTask={isAddingTask}
						isHidenSections={isHidenSections}
					/>
				</div>
			))}
			<Stack p={4} w="md">
				{isCreateSectionFormVisible ? (
					<CreateSectionForm
						isLoading={isCreateSectionPending}
						onClose={() => onCloseCreateSectionForm()}
						onAddSection={name => onCreateSection(name)}
					/>
				) : (
					<Button
						color="gray.50"
						bg="transparent"
						borderRadius="none"
						w="120px"
						onClick={() => onOpenCreateSectionForm()}>
						Add Section
					</Button>
				)}
			</Stack>
		</>
	)
}

export default ProjectDetailListView
