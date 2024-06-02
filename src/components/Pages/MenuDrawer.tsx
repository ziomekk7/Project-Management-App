import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  // DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import React from "react";
import Menu from "./Menu";

type MenuDrafterProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MenuDrawer: React.FC<MenuDrafterProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer placement="left" isOpen={isOpen} onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
          <Menu onClose={onClose} />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
