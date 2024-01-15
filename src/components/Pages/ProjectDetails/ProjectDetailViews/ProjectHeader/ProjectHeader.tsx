import { Project } from "../../../../../types/types";
import { DeleteIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { EllipsisHorizontal } from "../../../../UI/Icons/EllipsisHorizontal";

type ProjectHeaderProps = {
  project: Project;
  onDeleteProject: (projectId:string) => void;
  onChangeView: (view: string) => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onDeleteProject,
  onChangeView,
}) => {
  return (
    <Box h="15%">
      <Stack p={5} direction="row" spacing={8} w="100%">
        <Heading as="h1" size="xl">
          {project.name}
        </Heading>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<EllipsisHorizontal />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem onClick={() => onDeleteProject(project.id)} icon={<DeleteIcon />}>
              Delete project
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
      <Box>
        <Button onClick={() => onChangeView("list")} m={2} variant="link">
          Table View
        </Button>
        <Button onClick={() => onChangeView("board")} m={2} variant="link">
          Board View
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectHeader;
