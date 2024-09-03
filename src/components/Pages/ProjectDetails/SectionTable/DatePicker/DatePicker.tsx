import { Button, useDisclosure, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import DatePickerModal from "./DatePickerModal";
type DatePickerProps = {
  taskDate: Date | null;
  selectedDate: Date | null;
  onSelect: (selectedDate: Date) => void;
};
const DatePicker: React.FC<DatePickerProps> = ({
  taskDate,
  selectedDate,
  onSelect,
}) => {
  const datePickerModal = useDisclosure();

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      return;
    }

    onSelect(newDate);
  };

  return (
    <>
      <Button
        size="sm"
        w={24}
        variant="ghost"
        onClick={(e) => {
          datePickerModal.onOpen(), e.stopPropagation();
        }}
      >
        {taskDate ? (
          <Text>{format(taskDate, "d/L/yyyy")}</Text>
        ) : (
          <Text>---</Text>
        )}
      </Button>
      <DatePickerModal
        isOpen={datePickerModal.isOpen}
        onClose={datePickerModal.onClose}
        onSelect={(date) => {
          handleSelect(date), datePickerModal.onClose();
        }}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default DatePicker;
