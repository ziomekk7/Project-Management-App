import { Input, InputGroup } from '@chakra-ui/react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const createTaskFormSchema = z.object({
	newTask: z.string().min(1, { message: 'Name must contain at least 2 character(s)' }),
})

type CreateTaskFormProps = {
	onCreateTask: (newSection: string) => void
	isPanding: boolean
}

const CreateTaskForm: FC<CreateTaskFormProps> = ({ onCreateTask, isPanding }) => {
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
				<Input {...register('newTask')} isDisabled={isPanding} placeholder="My new task"></Input>
			</InputGroup>
			{errors.newTask?.message && <p>{errors.newTask?.message}</p>}
		</form>
	)
}

export default CreateTaskForm
