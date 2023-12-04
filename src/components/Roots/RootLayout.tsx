import { Grid, GridItem } from "@chakra-ui/react";
import Menu from "../Pages/Menu";
import React from "react";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid templateColumns="1fr 4fr ">
      <GridItem>
        <Menu />
      </GridItem>
      <GridItem>{children}</GridItem>
    </Grid>
  );
};
export default RootLayout;
