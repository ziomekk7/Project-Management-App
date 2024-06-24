import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
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
    <Drawer placement="left" isOpen={isOpen} onClose={onClose} size="xs" >
      <DrawerOverlay />
      <DrawerContent maxW="220px" p={0}>
        <DrawerBody>
          <DrawerCloseButton />

          <Menu onClose={onClose} />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
