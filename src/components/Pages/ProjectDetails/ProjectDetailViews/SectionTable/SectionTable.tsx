import { FC } from 'react'
import { Section } from '../../../../../types/types'
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Button,
	Stack,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from '@chakra-ui/react'
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons'
import CreateTaskFrom from '../../CreateTaskForm/CreateTaskForm'

type SectionTableProps = {
	section: Section
	onDeleteSection: () => void
	onDeleteTask: (sectionId: string, taskId: string) => void
	onCreateTask: (sectionId: string, taskName: string) => void
	isCreatingTask: boolean
	onCreateTaskFormVisible: (sectionId: string) => void
	isCreateTaskFormVisible: boolean
	actuallyDeletingTasks: string[]
}

const SectionTable: FC<SectionTableProps> = ({
	section,
	onCreateTask,
	onDeleteSection,
	onDeleteTask,
	isCreatingTask,
	onCreateTaskFormVisible,
	isCreateTaskFormVisible,
	actuallyDeletingTasks,
}) => {
	// @TODO isCreateTaskFormVisible

	const handleCreateTask = (taskName: string) => {
		onCreateTask(section.id, taskName)
	}

	return (
		<>
			<TableContainer>
				<Table variant="simple">
					<TableCaption>
						<Flex>
							{isCreateTaskFormVisible ? (
								<CreateTaskFrom
									onClose={() => {
										onCreateTaskFormVisible('')
									}}
									onCreateTask={handleCreateTask}
									isLoading={isCreatingTask}
								/>
							) : (
								<Button
									size="sm"
									onClick={() => {
										onCreateTaskFormVisible(section.id)
									}}>
									Add task
								</Button>
							)}
						</Flex>
					</TableCaption>
					<Thead>
						<Tr>
							<Th>
								<Stack direction="row" spacing={4} alignItems="center">
									<h1>{section.name}</h1>
									<Menu>
										<MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="outline" />
										<MenuList>
											<MenuItem onClick={onDeleteSection} icon={<DeleteIcon />}>
												Delete Section
											</MenuItem>
										</MenuList>
									</Menu>
								</Stack>
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{section.tasks.map(task => (
							<Tr key={task.id}>
								<Td>
									<Flex justifyContent="space-between">
										{task.name}

										<Button
											isLoading={actuallyDeletingTasks.includes(task.id)}
											onClick={() => onDeleteTask(section.id, task.id)}
											size="sm">
											Delete task
										</Button>
									</Flex>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	)
}

export default SectionTable
