import { Project } from '../../../../types/types'
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Heading, Stack } from '@chakra-ui/react'

type ProjectHeaderProps = {
	project: Project
	onDeleteProject: (projectId: string) => void
}

const ProjectHeader: React.FC<ProjectHeaderProps> = props => {
	return (
			<Stack p={5} direction="row" spacing={8}>
				<Heading as="h1" size="xl">
					{props.project.name}
				</Heading>
				<Menu>
					<MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="outline" />
					<MenuList>
						<MenuItem
							onClick={() => {
								props.onDeleteProject(props.project.id)
							}}
							icon={<DeleteIcon />}>
							delete project
						</MenuItem>
					</MenuList>
				</Menu>
			</Stack>
	)
}

export default ProjectHeader
