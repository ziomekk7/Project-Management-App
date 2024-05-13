import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import Menu from "../Pages/Menu";
import React from "react";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // const bodyStyles = useBreakpointValue({
  //   base: { size: "100px", bgColor: "red.200", borderRadius: "md" },
  //   sm: { size: "200px", bgColor: "blue.200", borderRadius: "xl" },
  //   md: { size: "150px", bgColor: "green.200", borderRadius: "lg" },
  //   lg: { size: "200px", bgColor: "blue.200", borderRadius: "xl" },
  // });
  const menuStyles = useBreakpointValue({
    base: "none",
    sm: "none",
    md: "block",
    lg: "block",
  });
  const bodyStyles = useBreakpointValue({
    base: "1",
    sm: "1",
    md: "2",
    lg: "2",
  });
  return (
    <Grid w="100%" h="100%" templateColumns="200px 1fr " className="test">
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
