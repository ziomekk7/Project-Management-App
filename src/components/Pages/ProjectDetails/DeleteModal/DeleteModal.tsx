import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";

export type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export const DeleteModal: FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const handleAccept = () => {
    onAccept();
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              If you confirm, the data will be irreversibly deleted. Are you
              sure?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAccept}>
              Yes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
