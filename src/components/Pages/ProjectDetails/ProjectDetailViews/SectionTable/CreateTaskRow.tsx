import { Flex } from '@chakra-ui/react'
import CreateTaskForm from '../../CreateTaskForm/CreateTaskForm'
import { FC } from 'react'
import { Task } from '../../../../../types/types'

type CreateTaskRowProps = {
	onCreateTask: (task:Task) => void
	isAddingTask: boolean
}

const CreateTaskRow: FC<CreateTaskRowProps> = ({ onCreateTask,  isAddingTask }) => {
	return (
		<Flex p={5} w="100%">
			<CreateTaskForm
				onCreateTask={task => onCreateTask(task)}
				isAddingTask={isAddingTask}
			/>
		</Flex>
	)
}

export default CreateTaskRow
