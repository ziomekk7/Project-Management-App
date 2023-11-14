import { Stack, Menu, MenuButton, MenuList, MenuItem, IconButton, Heading } from '@chakra-ui/react'
import { ChevronDownIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons'
import { Section } from '../../../../../types/types'
import { FC } from 'react'

type SectionHeaderProps = {
	section: Section
	onDeleteSection: () => void
    onToggleHideSection:()=>void
}

const SectionHeader: FC<SectionHeaderProps> = ({ section, onDeleteSection, onToggleHideSection }) => {
	return (
		<Stack p='5px' key={section.id} direction="row" spacing={4} alignItems="center">
            <IconButton aria-label='Toggle section' icon={<ChevronDownIcon />} onClick={onToggleHideSection}/>
			<Heading as='h2' size='md'>{section.name}</Heading>
			<Menu>
				<MenuButton as={IconButton} icon={<MinusIcon />} variant="outline" />
				<MenuList>
					<MenuItem onClick={onDeleteSection} icon={<DeleteIcon />}>
						Delete Section
					</MenuItem>
				</MenuList>
			</Menu>
		</Stack>
	)
}

export default SectionHeader
