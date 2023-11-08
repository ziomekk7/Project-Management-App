import { useNavigate, useParams } from 'react-router-dom'
import { getProjectById, deleteProject, DeleteProjectData } from '../../../api/projectsApi'
import ProjectDetailListView from './ProjectDetailViews/ProjectDetailListView'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ProjectHeader from './ProjectHeader/ProjectHeader'
import { routes } from '../../../routes'
import { queryKeys } from '../../../queryKeys'

const ProjectDetails = () => {
	const navigate = useNavigate()
	const params = useParams()
	const projectId = params.projectId || ''

	const queryClient = useQueryClient()
	const projectQuery = useQuery({
		// queryKey: [queryKeys.project.projectDetails, params.projectId],
		queryKey: queryKeys.projects.details({ projectId }),
		queryFn: () => getProjectById(projectId),
	})

	const deleteProjectMutation = useMutation({
		mutationFn: (data: DeleteProjectData) => deleteProject(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})

	const handleDeleteProject = (projectId: string) => {
		navigate(routes.home())
		deleteProjectMutation.mutate({ projectId: projectId })
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
			<ProjectDetailListView project={projectQuery.data} />
		</>
	)
}

export default ProjectDetails
