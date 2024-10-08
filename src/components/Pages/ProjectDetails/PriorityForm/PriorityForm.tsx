import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { TaskPriority } from "../../../../types/types";
import { PRIORITY_COLORS, PRIORITY_COLORS_HOVER } from "../../../../config";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: "High",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.LOW]: "Low",
  [TaskPriority.NONE]: "---",
};

type PriorityFormProps = {
  onChangePriority: (priority: TaskPriority) => void;
  selectedPriority: TaskPriority;
};

const PriorityForm: React.FC<PriorityFormProps> = ({
  onChangePriority,
  selectedPriority,
}) => {
  return (
    <Menu>
      <MenuButton
        size="sm"
        w={24}
        bg={
          !selectedPriority ? "transparent" : PRIORITY_COLORS[selectedPriority]
        }
        as={Button}
        _hover={{ bg: PRIORITY_COLORS_HOVER[selectedPriority] }}
        onClick={(e) => e.stopPropagation()}
      >
        {PRIORITY_LABELS[selectedPriority]}
      </MenuButton>

      <MenuList overflow="hidden" p={2} maxW="120px" minW="120px">
        {Object.values(TaskPriority).map((priority) => (
          <MenuItem
            key={priority}
            mb={2}
            w={24}
            bg={PRIORITY_COLORS[priority]}
            _hover={{ bg: PRIORITY_COLORS_HOVER[priority] }}
            onClick={(e) => {
              onChangePriority(priority), e.stopPropagation();
            }}
            h="30px"
            borderRadius="5px"
            display="flex"
            justifyContent="center"
          >
            {PRIORITY_LABELS[priority]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PriorityForm;
