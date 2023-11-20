import { Flex } from '@chakra-ui/react'
import CreateTaskForm from '../../CreateTaskForm/CreateTaskForm'
import { FC } from 'react'

type CreateTaskRowProps = {
	onCreateTask: (newTask: string) => void
	createTaskIsPending: boolean
	isAddingTask: boolean
}

const CreateTaskRow: FC<CreateTaskRowProps> = ({ onCreateTask, createTaskIsPending, isAddingTask }) => {
	return (
		<Flex p="5" w="100%">
			<CreateTaskForm
				onCreateTask={newTask => onCreateTask(newTask)}
				isPanding={createTaskIsPending}
				isAddingTask={isAddingTask}
			/>
		</Flex>
	)
}

export default CreateTaskRow
