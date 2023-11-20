import { useNavigate, useParams } from 'react-router-dom'
import {
	getProjectById,
	deleteProject,
	DeleteProjectData,
	createProjectSection,
	createTask,
	deleteSection,
	deleteTask,
	editTask,
} from '../../../api/projectsApi'
import ProjectDetailListView from './ProjectDetailViews/ProjectDetailListView'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ProjectHeader from './ProjectHeader/ProjectHeader'
import { routes } from '../../../routes'
import { queryKeys } from '../../../queryKeys'
import { Task } from '../../../types/types'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ProjectDetails = () => {
	const [isCreateSectionFormVisible, setIsCreateSectionFormVisible] = useState(false)
	const [actuallyDeletingTasks, setActuallyDeletingTasks] = useState<string[]>([])
	const [actuallyDeletingSections, setActuallyDeletingSections] = useState<string[]>([])
	const [isHidenSections, setIsHidenSection] = useState<string[]>([])
	const [isAddingTask, setIsAddingTask] = useState<{ sectionId: string; taskId: string } | null>(null)

	const navigate = useNavigate()
	const params = useParams()
	const projectId = params.projectId || ''

	const queryClient = useQueryClient()
	const projectQuery = useQuery({
		queryKey: queryKeys.projects.details({ projectId }),
		queryFn: () => getProjectById(projectId),
	})
	useEffect(() => {
		return () => {
			if (!projectQuery.data) {
				return
			}
			if (!isAddingTask) {
				return
			}
			const section = projectQuery.data.sections.find(section => isAddingTask.sectionId === section.id)
			if (!section) {
				return
			}

			if (!section.tasks.find(task => isAddingTask.taskId === task.id)) {
				setIsAddingTask(null)
			}
		}
	}, [projectQuery.data, isAddingTask])

	const deleteProjectMutation = useMutation({
		mutationFn: (data: DeleteProjectData) => deleteProject(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})

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
		onError: (_, variables) => {
			setActuallyDeletingSections(prevActuallyDeletingSections =>
				prevActuallyDeletingSections.filter(sectionId => sectionId !== variables.sectionId)
			)
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

	const handleDeleteProject = (projectId: string) => {
		navigate(routes.home())
		deleteProjectMutation.mutate({ projectId: projectId })
	}

	const handleCreateSection = (newSection: string) => {
		createProjectSectionMutation.mutate({
			newSection,
			projectId,
		})
	}

	const handleDeleteSection = (sectionId: string) => {
		setActuallyDeletingSections(prevActuallyDeletingSections => [...prevActuallyDeletingSections, sectionId])
		deleteSectionMutation.mutate({
			projectId,
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
		const newTaskId = uuidv4()
		setIsAddingTask({ sectionId: sectionId, taskId: newTaskId })
		createTaskMutation.mutate({
			projectId,
			sectionId: sectionId,
			newTask: newTask,
			taskId: newTaskId,
		})
	}

	const handleDeleteTask = (sectionId: string, taskId: string) => {
		setActuallyDeletingTasks(prevActuallyDeletingTasks => [...prevActuallyDeletingTasks, taskId])
		deleteTaskMutation.mutate({
			projectId,
			sectionId: sectionId,
			taskId: taskId,
		})
	}

	const handleEditTask = (task: Task, sectionId: string) => {
		editTaskMutation.mutate({
			projectId,
			sectionId: sectionId,
			task: task,
		})
	}

	if (!projectQuery.data) {
		if (projectQuery.isLoading) {
			return <div>Loading....</div>
		}

		return <div>Project not found</div>
	}

	return (
		<>
			<ProjectHeader project={projectQuery.data} onDeleteProject={handleDeleteProject} />
			<ProjectDetailListView
				actuallyDeletingSections={actuallyDeletingSections}
				project={projectQuery.data}
				isCreateTaskPending={createTaskMutation.isPending}
				isHidenSections={isHidenSections}
				isCreateSectionPending={createProjectSectionMutation.isPending}
				isCreateSectionFormVisible={isCreateSectionFormVisible}
				actuallyDeletingTasks={actuallyDeletingTasks}
				isAddingTask={!isAddingTask ? false : true}
				onCreateSection={handleCreateSection}
				onDeleteSection={handleDeleteSection}
				onDeleteTask={handleDeleteTask}
				onCreateTask={handleCreateTask}
				onEditTask={handleEditTask}
				onHideSectionId={handleHideSection}
				onOpenCreateSectionForm={() => setIsCreateSectionFormVisible(true)}
				onCloseCreateSectionForm={() => setIsCreateSectionFormVisible(false)}
			/>
		</>
	)
}

export default ProjectDetails
