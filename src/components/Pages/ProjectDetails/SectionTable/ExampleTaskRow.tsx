import { Grid, GridItem, Text } from "@chakra-ui/react";
const ExampleTaskRow = () => {
  const borderColor = "gray.700";
  return (
    <Grid
      templateColumns="2fr 1fr 1fr "
      borderBottom="1px solid"
      borderTop="1px solid"
      borderColor={borderColor}
    >
      <GridItem
        h={16}
        ml={10}
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
        justifyContent="flex-start"
        ml="20px"
      >
        <Text>Priority</Text>
      </GridItem>
    </Grid>
  );
};

export default ExampleTaskRow;
