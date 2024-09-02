import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import Menu from "../Pages/Menu";
import React from "react";
import { CustomScrollbar, showMd } from "../../config";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const menuStyles = useBreakpointValue(showMd);
  const bodyStyles = useBreakpointValue({
    base: "1",
    md: "2",
    lg: "2",
  });

  return (
    <Grid w="100%" h="100%" templateColumns="200px 1fr ">
      <GridItem
        display={menuStyles}
        gridColumnStart={1}
        gridColumnEnd={2}
        gridRowStart={1}
        gridRowEnd={2}
      >
        <Menu />
      </GridItem>
      <GridItem
        overflow="auto"
        css={CustomScrollbar}
        gridColumnStart={bodyStyles}
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
