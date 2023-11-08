import { createProjectSection, createTask, deleteSection, deleteTask } from '../../../../api/projectsApi'
import { Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import CreateSectionForm from '../CreateSectionForm/CreateSectionForm'
import SectionTable from './SectionTable/SectionTable'
import { Project } from '../../../../types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../../queryKeys'

type ProjectDetailListViewProps = {
	project: Project
}

const ProjectDetailListView: React.FC<ProjectDetailListViewProps> = ({ project }) => {
	const queryClient = useQueryClient()
	const [isCreateSectionFormVisible, setIsCreateSectionFormVisible] = useState(false)
	const [visibleCreateTaskFormSectionId, setVisibleCreateTaskFormSectionId] = useState('')
	const [actuallyDeletingTasks, setActuallyDeletingTasks] = useState<string[]>([])

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
			setVisibleCreateTaskFormSectionId('')
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

	const handleCreateSection = (newSection: string) => {
		createProjectSectionMutation.mutate({
			newSection,
			projectId: project.id,
		})
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
	const handleDeleteSection = (sectionId: string) => {
		deleteSectionMutation.mutate({
			projectId: project.id,
			sectionId: sectionId,
		})
	}

	return (
		<>
			{project.sections.map(section => (
				<div key={section.id}>
					<SectionTable
						key={section.id}
						section={section}
						isCreatingTask={createTaskMutation.isPending}
						isCreateTaskFormVisible={visibleCreateTaskFormSectionId === section.id}
						actuallyDeletingTasks={actuallyDeletingTasks}
						onDeleteSection={() => handleDeleteSection(section.id)}
						onDeleteTask={handleDeleteTask}
						onCreateTask={handleCreateTask}
						onCreateTaskFormVisible={sectionId => setVisibleCreateTaskFormSectionId(sectionId)}
					/>
				</div>
			))}
			{isCreateSectionFormVisible ? (
				<CreateSectionForm
					isLoading={createProjectSectionMutation.isPending}
					onClose={() => setIsCreateSectionFormVisible(false)}
					onAddSection={handleCreateSection}
				/>
			) : (
				<Button onClick={() => setIsCreateSectionFormVisible(true)}>Add Section</Button>
			)}
		</>
	)
}

export default ProjectDetailListView
