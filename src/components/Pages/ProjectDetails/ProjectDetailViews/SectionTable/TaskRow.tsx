import {
	Button,
	Stack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from '@chakra-ui/react'
import { Task } from '../../../../../types/types'
import { FC, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type TaskRowProps = {
	actuallyDeletingTasks: string[]
	onDeleteTask: (taskId: string) => void
	task: Task
	onEditTask: (task: Task) => void
}

const TaskRow: FC<TaskRowProps> = ({ actuallyDeletingTasks, onDeleteTask, task, onEditTask }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(task.date)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const handleAddDate = (execiutionDate?: Date) => {
		if (!execiutionDate) {
			return
		}
		setSelectedDate(execiutionDate)
		onEditTask({ name: task.name, id: task.id, date: execiutionDate })
	}

	return (
		<Stack p={5} direction="row" spacing={8} justifyContent="space-between">
			<p>{task.name}</p>
			<Button w={120} onClick={onOpen}>
				{task.date ? (
					<p>
						{task.date.getDate()}/{task.date.getMonth()}/{task.date.getFullYear()}
					</p>
				) : (
					<p></p>
				)}
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Execution date</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedDate ? (
							<DayPicker mode="single" selected={selectedDate} onSelect={handleAddDate} />
						) : (
							<DayPicker mode="single" selected={new Date()} onSelect={handleAddDate} />
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			<Button isLoading={actuallyDeletingTasks.includes(task.id)} onClick={() => onDeleteTask(task.id)} size="sm">
				Delete task
			</Button>
		</Stack>
	)
}

export default TaskRow
