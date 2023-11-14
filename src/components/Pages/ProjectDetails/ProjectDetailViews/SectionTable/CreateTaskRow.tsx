import { Flex } from '@chakra-ui/react'
import CreateTaskForm from '../../CreateTaskForm/CreateTaskForm'
import { FC } from 'react'

type CreateTaskRowProps = {
	onCreateTask: (newTask: string) => void
	createTaskIsPending: boolean
	
}

const CreateTaskRow: FC<CreateTaskRowProps> = ({ onCreateTask, createTaskIsPending }) => {
	return (
		<Flex p="5">
			<CreateTaskForm onCreateTask={newTask => onCreateTask(newTask)} isPanding={createTaskIsPending}  />
		</Flex>
	)
}

export default CreateTaskRow
