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
import { Section } from "../../../../types/types";
import { FC } from "react";
import { EllipsisHorizontal } from "../../../UI/Icons/EllipsisHorizontal";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

type SectionHeaderProps = {
  section: Section;
  onDeleteSection: () => void;
  onToggleHideSection: () => void;
  hiddenSections: string[];
};

const SectionHeader: FC<SectionHeaderProps> = ({
  section,
  onDeleteSection,
  onToggleHideSection,
  hiddenSections,
}) => {
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  //   // isDragging
  // } = useSortable({
  //   id: section.id,
  //   data: {
  //     type: "section",
  //     section,
  //   },
  // });

  // const style = {
  //   transition,
  //   transform: CSS.Translate.toString(transform),
  // };
  
  // const tasksId = useMemo(
  //   () => section.tasks.map((item) => item.id),
  //   [section]
  // );
  return (
    <Stack
      h={20}
      key={section.id}
      direction="row"
      spacing={4}
      alignItems="center"
      borderBottom="1px solid black"
      mt={3}
      // ref={setNodeRef}
      // style={style}
      // {...attributes}
      // {...listeners}

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
