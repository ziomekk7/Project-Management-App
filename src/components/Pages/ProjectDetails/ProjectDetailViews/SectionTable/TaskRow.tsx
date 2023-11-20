import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Grid,
	GridItem,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { Task, TaskPriority } from '../../../../../types/types'
import { FC, useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import PriorityForm from '../../PriorityForm/PriorityForm'

type TaskRowProps = {
	actuallyDeletingTasks: string[]
	onDeleteTask: (taskId: string) => void
	task: Task
	onEditTask: (task: Task) => void
}

const TaskRow: FC<TaskRowProps> = ({ actuallyDeletingTasks, onDeleteTask, task, onEditTask }) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(task.date)
	const [isLoadingDate, setIsLoadingDate] = useState(false)
	const [selectedPriority, setSelectedPriority] = useState(task.priority)
	const { isOpen, onOpen, onClose } = useDisclosure()
	useEffect(() => {
		return () => {
			setIsLoadingDate(false)
		}
	}, [task])

	const handleChangeDate = (execiutionDate?: Date) => {
		if (!execiutionDate) {
			return
		}
		setIsLoadingDate(true)
		setSelectedDate(execiutionDate)
		onEditTask({ name: task.name, id: task.id, date: execiutionDate, priority: task.priority })
	}

	const handleChangePriority = (priority: TaskPriority) => {
		if (!priority) {
			return
		}

		setSelectedPriority(priority)
		onEditTask({ name: task.name, id: task.id, date: task.date, priority: priority })
	}

	return (
		<Grid h="60px" templateColumns="3fr 1fr 1fr " borderBottom="1px solid black">
			<GridItem ml={10} borderRight="1px solid black" display="flex" alignItems="center">
				<Text>{task.name}</Text>
				<Menu>
					<MenuButton
						border="none"
						bg="transparent"
						borderRadius="none"
						as={IconButton}
						icon={<i className="fa-solid fa-ellipsis" />}
						variant="outline"
						isLoading={actuallyDeletingTasks.includes(task.id)}
					/>
					<MenuList>
						<MenuItem onClick={() => onDeleteTask(task.id)} icon={<DeleteIcon />}>
							Delete Task
						</MenuItem>
					</MenuList>
				</Menu>
			</GridItem>
			<GridItem borderRight="1px solid black" display="flex" alignItems="center" justifyContent="center">
				<Button isLoading={isLoadingDate} color="gray.50" bg="transparent" w={120} variant="ghost" onClick={onOpen}>
					{task.date ? (
						<Text>
							{task.date.getDate()}/{task.date.getMonth()}/{task.date.getFullYear()}
						</Text>
					) : (
						<Text>None</Text>
					)}
				</Button>
			</GridItem>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Execution date</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedDate ? (
							<DayPicker mode="single" selected={selectedDate} onSelect={handleChangeDate} />
						) : (
							<DayPicker mode="single" selected={new Date()} onSelect={handleChangeDate} />
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
			<GridItem borderRight="1px solid black" display="flex" alignItems="center" justifyContent="flex-start" ml="20px">
				<PriorityForm onSelectPriority={handleChangePriority} selectedPriority={selectedPriority} />
			</GridItem>
		</Grid>
	)
}

export default TaskRow
