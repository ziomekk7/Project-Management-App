import { Project } from "../../../../../types/types";
import { DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Heading,
  Stack,
  Box,
  Button,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { EllipsisHorizontal } from "../../../../UI/Icons/EllipsisHorizontal";
import { DeleteModal } from "../../DeleteModal/DeleteModal";
import MenuDrawer from "../../../MenuDrawer";
import { hideMd } from "../../../../../config";

type ProjectHeaderProps = {
  project: Project;
  onDeleteProject: (projectId: string) => void;
  onChangeView: (view: string) => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onDeleteProject,
  onChangeView,
}) => {
  const deleteTaskModal = useDisclosure();
  const burgerMenuDrafter = useDisclosure();
  const burgerButtonStyle = useBreakpointValue(hideMd);

  return (
    <Box position="sticky" zIndex={1} top={0} background="gray.800">
      <Stack
        mt={2}
        mb={2}
        direction="row"
        spacing={8}
        w="100%"
        justifyContent="space-between"
      >
        <Stack direction="row">
          <Heading as="h1" size="lg">
            {project.name}
          </Heading>
          <Menu>
            <MenuButton
            ml={4}
              as={IconButton}
              icon={<EllipsisHorizontal />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={deleteTaskModal.onOpen} icon={<DeleteIcon />}>
                Delete project
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
        <IconButton
          display={burgerButtonStyle}
          aria-label="Open burger menu"
          icon={<HamburgerIcon />}
          onClick={burgerMenuDrafter.onOpen}
        />
      </Stack>
      <Box>
        <Button onClick={() => onChangeView("list")} m={2} variant="link">
          Table View
        </Button>
        <Button onClick={() => onChangeView("board")} m={2} variant="link">
          Board View
        </Button>
      </Box>
      <DeleteModal
        isOpen={deleteTaskModal.isOpen}
        onClose={deleteTaskModal.onClose}
        onAccept={() => onDeleteProject(project.id)}
      />
      <MenuDrawer
        onClose={burgerMenuDrafter.onClose}
        isOpen={burgerMenuDrafter.isOpen}
      />
    </Box>
  );
};

export default ProjectHeader;
