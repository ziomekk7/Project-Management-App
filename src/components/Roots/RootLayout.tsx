import { getProjects } from '../../api/projectsApi'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Menu, MenuButton, MenuList, MenuItem, Flex } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { routes } from '../../routes'
import { queryKeys } from '../../queryKeys'

const RootLayout = () => {
	const projectsQuery = useQuery({
		queryKey: queryKeys.projects.all(),
		queryFn: getProjects,
	})

	if (projectsQuery.isLoading) {
		return <div>Loading....</div>
	}

	return (
		<Flex direction="row" justify="space-between"  >
			<Menu>
				<MenuButton  bg='transparent' color='gray.50' borderRadius='none' as={Button} rightIcon={<ChevronDownIcon />}>
					All Projects
				</MenuButton>
				<MenuList>
					{projectsQuery.data?.map(project => (
						<MenuItem key={project.id}>
							<Link to={routes.projects.details({projectId:project.id})}>{project.name}</Link>
						</MenuItem>
					))}
				</MenuList>
			</Menu>
			<h1>Project Management</h1>
			<Button bg='transparent'borderRadius='none'>
				<Link to={routes.projects.create()}>Add Project</Link>
			</Button>
		</Flex>
	)
}

export default RootLayout
