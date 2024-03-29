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
        w={120}
        bg={
          !selectedPriority ? "transparent" : PRIORITY_COLORS[selectedPriority]
        }
        as={Button}
        _hover={{ bg: PRIORITY_COLORS_HOVER[selectedPriority] }}
        onClick={(e) => e.stopPropagation()}
      >
        {PRIORITY_LABELS[selectedPriority]}
      </MenuButton>

      <MenuList overflow="hidden" p={2} >
        {Object.values(TaskPriority).map((priority) => (
          <MenuItem
            mb={2}
            key={priority}
            as={Button}
            bg={PRIORITY_COLORS[priority]}
            _hover={{ bg: PRIORITY_COLORS_HOVER[priority] }}
            onClick={(e) => {
              onChangePriority(priority), e.stopPropagation();
            }}
          >
            {PRIORITY_LABELS[priority]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PriorityForm;
