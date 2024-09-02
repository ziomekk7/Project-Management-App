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
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              bg="red.600"
              _hover={{ bg: "red.700" }}
              variant="solid"
              mr={3}
              onClick={handleAccept}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
