import { Grid, GridItem, Text } from "@chakra-ui/react";
const ExampleTaskRow = () => {
  return (
    <Grid
      templateColumns="2fr 1fr 1fr "
      borderBottom="1px solid black"
      borderTop="1px solid black"
    >
      <GridItem
        h={16}
        ml={10}
        borderRight="1px solid black"
        display="flex"
        alignItems="center"
      >
        <Text>Task Name</Text>
      </GridItem>
      <GridItem
        borderRight="1px solid black"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Execution Date</Text>
      </GridItem>

      <GridItem
        borderRight="1px solid black"
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
