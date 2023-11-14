import { createProjectSection, createTask, deleteSection, deleteTask, editTask } from '../../../../api/projectsApi'
import { Button, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import CreateSectionForm from '../CreateSectionForm/CreateSectionForm'
import { Project, Task } from '../../../../types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../../queryKeys'
import TaskRow from './SectionTable/TaskRow'
import SectionHeader from './SectionTable/SectionHeader'
import CreateTaskRow from './SectionTable/CreateTaskRow'

type ProjectDetailListViewProps = {
	project: Project
}

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({ project}) => {
	const queryClient = useQueryClient()
	const [isCreateSectionFormVisible, setIsCreateSectionFormVisible] = useState(false)
	const [actuallyDeletingTasks, setActuallyDeletingTasks] = useState<string[]>([])
	const [isHidenSections, setIsHidenSection] = useState<string[]>([])

	const createProjectSectionMutation = useMutation({
		mutationFn: createProjectSection,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
			setIsCreateSectionFormVisible(false)
		},
	})

	const createTaskMutation = useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})

	const deleteSectionMutation = useMutation({
		mutationFn: deleteSection,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})

	const deleteTaskMutation = useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
		onError: (_, variables) => {
			setActuallyDeletingTasks(prevActuallyDeletingTasks =>
				prevActuallyDeletingTasks.filter(taskId => taskId !== variables.taskId)
			)
		},
	})

	const editTaskMutation = useMutation({
		mutationFn: editTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})

	const handleCreateSection = (newSection: string) => {
		createProjectSectionMutation.mutate({
			newSection,
			projectId: project.id,
		})
	}

	const handleDeleteSection = (sectionId: string) => {
		deleteSectionMutation.mutate({
			projectId: project.id,
			sectionId: sectionId,
		})
	}

	const handleHideSection = (hidedSectionId: string) => {
		if (!isHidenSections.find(sectionId => sectionId === hidedSectionId)) {
			setIsHidenSection(prevHidenSections => [...prevHidenSections, hidedSectionId])
		} else {
			setIsHidenSection(isHidenSections.filter(sectionId => sectionId !== hidedSectionId))
		}
	}

	const handleCreateTask = (sectionId: string, newTask: string) => {
		createTaskMutation.mutate({
			projectId: project.id,
			sectionId: sectionId,
			newTask: newTask,
		})
	}

	const handleDeleteTask = (sectionId: string, taskId: string) => {
		setActuallyDeletingTasks(prevActuallyDeletingTasks => [...prevActuallyDeletingTasks, taskId])
		deleteTaskMutation.mutate({
			projectId: project.id,
			sectionId: sectionId,
			taskId: taskId,
		})
	}

	const handleEditTask = (task: Task, sectionId: string) => {

		editTaskMutation.mutate({
			projectId: project.id,
			sectionId: sectionId,
			task: task,
		})
	}
	return (
		<>
			{project.sections.map(section => (
				<div key={section.id}>
					<SectionHeader
						section={section}
						onDeleteSection={() => handleDeleteSection(section.id)}
						onToggleHideSection={() => handleHideSection(section.id)}
					/>
					{!isHidenSections.find(sectionId => sectionId === section.id) ? (
						<div>
							{section.tasks.map(task => (
								<TaskRow
									key={task.id}
									task={task}
									onDeleteTask={taskId => handleDeleteTask(section.id, taskId)}
									actuallyDeletingTasks={actuallyDeletingTasks}
									onEditTask={task => handleEditTask(task, section.id)}
								/>
							))}
							<CreateTaskRow
								onCreateTask={newTask => handleCreateTask(section.id, newTask)}
								createTaskIsPending={createTaskMutation.isPending}
							/>
						</div>
					) : null}
				</div>
			))}
			<Stack p={4} w="md">
				{isCreateSectionFormVisible ? (
					<CreateSectionForm
						isLoading={createProjectSectionMutation.isPending}
						onClose={() => setIsCreateSectionFormVisible(false)}
						onAddSection={handleCreateSection}
					/>
				) : (
					<Button w="120px" onClick={() => setIsCreateSectionFormVisible(true)}>
						Add Section
					</Button>
				)}
			</Stack>
		</>
	)
}

export default ProjectDetailListView
