import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Text,
} from '@chakra-ui/react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
type DatePickerProps = {
	isLoadingDate: boolean
	taskDate: Date | null
	selectedDate: Date | null
	onSelect: (selectedDate: Date | undefined) => void
}
const DatePicker: React.FC<DatePickerProps> = ({ isLoadingDate, taskDate, selectedDate, onSelect }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	return (
		<>
			<Button isLoading={isLoadingDate} w={120} variant="ghost" onClick={onOpen}>
				{taskDate ? (
					<Text>
						{taskDate.getDate()}/{taskDate.getMonth()}/{taskDate.getFullYear()}
					</Text>
				) : (
					<Text>---</Text>
				)}
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Execution date</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedDate ? (
							<DayPicker mode="single" selected={selectedDate} onSelect={selectedDate => onSelect(selectedDate)} />
						) : (
							<DayPicker mode="single" selected={new Date()} onSelect={selectedDate => onSelect(selectedDate)} />
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

export default DatePicker
