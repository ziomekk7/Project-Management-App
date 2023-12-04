import {
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import DatePickerModal from "./DatePickerModal";
type DatePickerProps = {
  isLoadingDate: boolean;
  taskDate: Date | null;
  selectedDate: Date | null;
  onSelect: (selectedDate: Date) => void;
};
const DatePicker: React.FC<DatePickerProps> = ({
  isLoadingDate,
  taskDate,
  selectedDate,
  onSelect,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      return;
    }

    onSelect(newDate);
  };

  return (
    <>
      <Button
        isLoading={isLoadingDate}
        w={120}
        variant="ghost"
        onClick={onOpen}
      >
        {taskDate ? (
          <Text>{format(taskDate, "d/L/yyyy")}</Text>
        ) : (
          <Text>---</Text>
        )}
      </Button>
      <DatePickerModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={handleSelect}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default DatePicker;
