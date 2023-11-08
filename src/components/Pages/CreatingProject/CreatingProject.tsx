import { FormControl, FormLabel, Input, Button, Container, Flex } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { createProject } from '../../../api/projectsApi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { routes } from '../../../routes'
import { queryKeys } from '../../../queryKeys'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'

const createProjectFormSchema = z.object({
	newProject: z.string().min(5, { message: 'Name must contain at least 5 character(s)' }),
})

const CreatingProject = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const createProjectMutation = useMutation({
		mutationFn: createProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() })
		},
	})
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof createProjectFormSchema>>({
		resolver: zodResolver(createProjectFormSchema),
	})

	const handleAddProject = async (newProject: string) => {
		const projectId = uuidv4()
		await createProjectMutation.mutate({ newProject, projectId })
		navigate(routes.projects.details({ projectId }))
	}
	if (createProjectMutation.isPending) {
		return <p>Loading</p>
	}

	return (
		<Container>
			<form
				onSubmit={handleSubmit(data => {
					handleAddProject(data.newProject)
				})}>
				<FormControl>
					<Flex direction="column" align="center">
						<FormLabel htmlFor="newProject">New Project</FormLabel>
						<Input {...register('newProject')} id="newProject" placeholder="My first project" autoFocus />

						<Flex direction="row" justify="space-between">
							{createProjectMutation.isPending ? (
								<div>Loading</div>
							) : (
								<>
									{' '}
									<Button type="submit">Add</Button>
									<Button as={Link} to={routes.home()}>
										Cancel
									</Button>
								</>
							)}
						</Flex>
					</Flex>
				</FormControl>
				{errors.newProject?.message && <p>{errors.newProject?.message}</p>}
			</form>
		</Container>
	)
}

export default CreatingProject
