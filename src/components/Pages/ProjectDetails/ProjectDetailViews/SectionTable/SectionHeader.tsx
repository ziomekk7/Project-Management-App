import { Stack, Menu, MenuButton, MenuList, MenuItem, IconButton, Heading } from '@chakra-ui/react'
import { ChevronDownIcon, DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Section } from '../../../../../types/types'
import { FC } from 'react'

type SectionHeaderProps = {
	section: Section
	onDeleteSection: () => void
	onToggleHideSection: () => void
	isHidenSections: string[]
	actuallyDeletingSections: string[]
}

const SectionHeader: FC<SectionHeaderProps> = ({
	section,
	onDeleteSection,
	onToggleHideSection,
	isHidenSections,
	actuallyDeletingSections,
}) => {
	return (
		<Stack h={20} key={section.id} direction="row" spacing={4} alignItems="center" borderBottom="1px solid black">
			<IconButton
				bg="transparent"
				borderRadius="none"
				aria-label="Toggle section"
				icon={!isHidenSections.find(sectionId => sectionId === section.id) ? <ChevronDownIcon /> : <ChevronRightIcon />}
				onClick={onToggleHideSection}
			/>
			<Heading as="h2" size="md">
				{section.name}
			</Heading>
			<Menu>
				<MenuButton
					isLoading={actuallyDeletingSections.includes(section.id)}
					border="none"
					bg="transparent"
					borderRadius="none"
					as={IconButton}
					icon={<i className="fa-solid fa-ellipsis" />}
					variant="outline"
				/>
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
