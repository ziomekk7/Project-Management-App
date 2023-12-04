import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type DatePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSelect: (date: Date | undefined) => void;
};

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Execution date</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DayPicker
            mode="single"
            selected={selectedDate ? selectedDate : new Date()}
            onSelect={(date) => onSelect(date)}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DatePickerModal;
