import { Input, InputGroup, InputRightAddon, Button, ButtonGroup } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createSectionFormSchema = z.object({
	newSection: z.string().min(5, { message: 'Name must contain at least 5 character(s)' }),
})

type CreateSectionFormProps = {
	isLoading: boolean
	onClose: () => void
	onAddSection: (newSection: string) => void
}
const CreateSectionForm: React.FC<CreateSectionFormProps> = props => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof createSectionFormSchema>>({
		resolver: zodResolver(createSectionFormSchema),
	})

	return (
		<form
			onSubmit={handleSubmit(data => {
				props.onAddSection(data.newSection)
			})}>
			<InputGroup>
				<Input
					{...register('newSection')}
					isDisabled={props.isLoading}
					placeholder="Name of new section"
					autoFocus></Input>
				<InputRightAddon>
					<ButtonGroup isAttached variant="outline">
						<Button isLoading={props.isLoading} type="submit" size="md">
							Add
						</Button>
						<Button
							isDisabled={props.isLoading}
							onClick={() => {
								props.onClose()
							}}
							size="md">
							Cancel
						</Button>
					</ButtonGroup>
				</InputRightAddon>
			</InputGroup>
			{errors.newSection?.message && <p>{errors.newSection?.message}</p>}
		</form>
	)
}

export default CreateSectionForm
