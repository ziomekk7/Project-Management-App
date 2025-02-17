import { Grid, GridItem, Text, useBreakpointValue } from "@chakra-ui/react";
const ExampleTaskRow = () => {
  const exampleTaskRowStyles = useBreakpointValue({
    base: "none",
    md: "grid ",
    lg: "grid ",
  });
  const borderColor = "gray.700";
  return (
    <Grid
      display={exampleTaskRowStyles}
      templateColumns="4fr minmax(5px, 1fr) minmax(120px, 1fr)"
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor={borderColor}
      fontSize="xs"
      backgroundColor="gray.800"
    >
      <GridItem
        h={10}
        ml={20}
        borderRight="1px solid "
        display="flex"
        alignItems="center"
        borderColor={borderColor}
      >
        <Text>Task Name</Text>
      </GridItem>
      <GridItem
        borderRight="1px solid"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Execution Date</Text>
      </GridItem>

      <GridItem
        display="flex"
        alignItems="center"
        justifyContent="center"
        ml={5}
      >
        <Text>Priority</Text>
      </GridItem>
    </Grid>
  );
};

export default ExampleTaskRow;
