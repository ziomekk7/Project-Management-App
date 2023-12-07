import { Grid, GridItem } from "@chakra-ui/react";
import Menu from "../Pages/Menu";
import React from "react";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid
      w="100%"
      h="100%"
      templateColumns="200px 1fr "
      className="test"
    >
      <GridItem
        gridColumnStart={1}
        gridColumnEnd={2}
        gridRowStart={1}
        gridRowEnd={2}
      >
        <Menu />
      </GridItem>
      <GridItem
        overflow="auto"
        gridColumnStart={2}
        gridColumnEnd={3}
        gridRowStart={1}
        gridRowEnd={2}
      >
        {children}
      </GridItem>
    </Grid>
  );
};
export default RootLayout;
