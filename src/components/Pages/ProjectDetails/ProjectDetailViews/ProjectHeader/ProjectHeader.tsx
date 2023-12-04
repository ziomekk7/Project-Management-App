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
} from "@chakra-ui/react";
import { EllipsisHorizontal } from "../../../../UI/icons";

type ProjectHeaderProps = {
  project: Project;
  onDeleteProject: () => void;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onDeleteProject }) => {
  return (
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
          <MenuItem onClick={()=>onDeleteProject()} icon={<DeleteIcon />}>
            Delete project
          </MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
};

export default ProjectHeader;
