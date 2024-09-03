import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const StyledDayPicker = styled(DayPicker)`
  .rdp-day_selected {
    background-color: #1a202c;
    color: white;
  }
  .rdp-day:hover:not(.rdp-day_selected) {
    background-color: #1a202c;
  }
`;

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
      <ModalContent w={80}>
        <ModalHeader>Execution date</ModalHeader>
        <ModalCloseButton />
        <ModalBody m={0} p={0}>
          <StyledDayPicker
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
