import { Input, InputGroup, InputRightAddon, Button, ButtonGroup } from '@chakra-ui/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createTaskFormSchema = z.object({
	newTask: z.string().min(5, { message: 'Name must contain at least 5 character(s)' }),
})

type CreateTaskFormProps = {
	onClose: () => void
	onCreateTask: (newSection: string) => void
	isLoading: boolean
}

const CreateTaskForm: FC<CreateTaskFormProps> = ({ onCreateTask, onClose, isLoading }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof createTaskFormSchema>>({
		resolver: zodResolver(createTaskFormSchema),
	})

	return (
		<form
			onSubmit={handleSubmit(data => {
				onCreateTask(data.newTask)
			})}>
			<InputGroup>
				<Input {...register('newTask')} isDisabled={isLoading} placeholder="My new task" autoFocus></Input>
				<InputRightAddon>
					<ButtonGroup isAttached variant="outline">
						<Button isLoading={isLoading} type="submit">
							Add
						</Button>
						<Button onClick={onClose} isDisabled={isLoading} size="md">
							Cancel
						</Button>
					</ButtonGroup>
				</InputRightAddon>
			</InputGroup>
			{errors.newTask?.message && <p>{errors.newTask?.message}</p>}
		</form>
	)
}

export default CreateTaskForm
