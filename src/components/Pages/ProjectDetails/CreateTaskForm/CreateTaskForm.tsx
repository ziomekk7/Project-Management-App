import { Input, InputGroup, Text, Stack } from '@chakra-ui/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const createTaskFormSchema = z.object({
	newTask: z.string().min(1, { message: 'Name must contain at least 2 character(s)' }),
})

type CreateTaskFormProps = {
	onCreateTask: (newTask: string) => void
	isPanding: boolean
	isAddingTask: boolean
}

const CreateTaskForm: FC<CreateTaskFormProps> = ({ onCreateTask, isAddingTask }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof createTaskFormSchema>>({
		resolver: zodResolver(createTaskFormSchema),
	})

	return (
		<Stack w="100%">
			<form
				onSubmit={handleSubmit(data => {
					onCreateTask(data.newTask)
				})}>
				<InputGroup>
					<Input {...register('newTask')} isDisabled={isAddingTask} placeholder="My new task " ></Input>
				</InputGroup>
				{errors.newTask?.message && <Text>{errors.newTask?.message}</Text>}
			</form>
		</Stack>
	)
}

export default CreateTaskForm
