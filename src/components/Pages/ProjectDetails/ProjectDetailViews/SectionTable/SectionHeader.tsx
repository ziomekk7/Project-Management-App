import {
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  DeleteIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Section } from "../../../../../types/types";
import { FC } from "react";
import { EllipsisHorizontal } from "../../../../UI/icons";

type SectionHeaderProps = {
  section: Section;
  onDeleteSection: () => void;
  onToggleHideSection: () => void;
  hiddenSections: string[];
  actuallyDeletingSections: string[];
};

const SectionHeader: FC<SectionHeaderProps> = ({
  section,
  onDeleteSection,
  onToggleHideSection,
  hiddenSections,
  actuallyDeletingSections,
}) => {
  return (
    <Stack
      h={20}
      key={section.id}
      direction="row"
      spacing={4}
      alignItems="center"
      borderBottom="1px solid black"
    >
      <IconButton
        aria-label="Toggle section"
        icon={
          !hiddenSections.find((sectionId) => sectionId === section.id) ? (
            <ChevronDownIcon />
          ) : (
            <ChevronRightIcon />
          )
        }
        onClick={onToggleHideSection}
        variant="ghost"
      />
      <Heading as="h2" size="md">
        {section.name}
      </Heading>
      <Menu>
        <MenuButton
          isLoading={actuallyDeletingSections.includes(section.id)}
          as={IconButton}
          icon={<EllipsisHorizontal />}
          variant="ghost"
        />
        <MenuList>
          <MenuItem onClick={onDeleteSection} icon={<DeleteIcon />}>
            Delete Section
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};

export default SectionHeader;
