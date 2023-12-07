import { Box, Grid, GridItem, Stack } from "@chakra-ui/react";

const TestComponent = () => {
  return (
    <Grid
      w="400px"
      h="400px"
      gridTemplateColumns="50px 2fr"
      gridTemplateRows="1fr 1fr"
    >
      <GridItem
        gridColumnStart={1}
        gridColumnEnd={2}
        gridRowStart={1}
        gridRowEnd={3}
      >
        <Box w="100%" h="100%" bg="blue">
          1
        </Box>
      </GridItem>
      <GridItem
        gridColumnStart={2}
        gridColumnEnd={3}
        gridRowStart={2}
        gridRowEnd={3}
        overflow="auto"
      >
        <Box w="110%" h="120%" bg="green">
          2
        </Box>
      </GridItem>
      <GridItem
        gridColumnStart={2}
        gridColumnEnd={3}
        gridRowStart={1}
        gridRowEnd={2}
      >
        <Box w="100%" h="100%" bg="yellow">
          3
        </Box>
      </GridItem>
    </Grid>
  );
};

export default TestComponent;
