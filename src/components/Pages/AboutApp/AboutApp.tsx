import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  IconButton,
  Image,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { hideMd } from "../../../config";
import MenuDrawer from "../MenuDrawer";
import createProject from "../../../images/createProject1.jpg";
import editSection from "../../../images/editSection1.jpg";
import moveSection from "../../../images/moveSection1.jpg";
import createTaskBoardView from "../../../images/createEditTaskBoardView1.jpg";
import createTaskListView from "../../../images/createEditTaskListView1.jpg";
import moveTask from "../../../images/moveTask1.jpg";
import taskDetails from "../../../images/taskDetails1.jpg";
import React, { useEffect } from "react";
import dnd from "../../../images/dnd.png";
import chakraUi from "../../../images/chakraUi.png";
import react from "../../../images/laptop.png";
import quill from "../../../images/quill.png";
import zod from "../../../images/zod.png";

type InstructionCardProps = {
  src: string;
  context: string;
};

const InstructionCard: React.FC<InstructionCardProps> = ({ src, context }) => {
  useEffect(() => {
    document.title = "Management - Home";
    return () => {
      document.title = "Management";
    };
  }, []);
  return (
    <Card bgColor="gray.800">
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Image src={src} />
            <Divider />
            <Text mt={3}>{context}</Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export const AboutApp = () => {
  const burgerMenuDrafter = useDisclosure();
  const burgerButtonStyle = useBreakpointValue(hideMd);

  const instructionData = [
    {
      name: "Project",
      instructions: [
        {
          src: createProject,
          context: `If you want to create a new project, you have to click the "Create Project" button (1) on the left side. 
                Next, enter the project name and press the "Create" button (2) or press Enter. 
                The application will automatically redirect you to the new project. 
                If you have more than one project, you can switch between them by selecting the project in the menu on the left side (3). 
                To delete a project, click the menu button (5) near the project name and press the "Delete Project" button. 
                You can use two views. To change the view, you have to click on the chosen view (4).`,
        },
      ],
    },
    {
      name: "Section",
      instructions: [
        {
          src: editSection,
          context:
            "To delete a section, press the button (1) and click 'Delete Section.' In list view, you can hide/show the tasks list by pressing button (2).",
        },
        {
          src: moveSection,
          context:
            "To change the order of sections, grab the button (1), move the section to the desired place, and then drop it.",
        },
      ],
    },
    {
      name: "Task",
      instructions: [
        {
          src: createTaskListView,
          context: `Click on the input (1), enter the task name, and press Enter. To change an existing task name, just click on the task name (2) and edit it. 
                To move a task to another section, click button (3), choose the section where the task should be sent (4), and click it. 
                After clicking the button (5), you can open task details. 
                To set the execution date, press button (6). In the execution date window (7), choose a date and click it. 
                To set the priority, click button (8) and choose the priority in the priority menu (9).`,
        },
        {
          src: createTaskBoardView,
          context: `Click on the input (1), enter the task name, and press Enter. To delete a task, press the button (2), to change an existing task name, just click on the task name (3) and edit it. 
                To set the execution date, press button (4). In the execution date window (5), choose a date and click it. 
                To set the priority, click button (6) and choose the priority in the priority menu (7). Click on the task card (8) to open task details.`,
        },
        {
          src: moveTask,
          context:
            "To change the order of tasks, grab the button (1), move it to the desired place, and then drop it. You can also move a task to another section.",
        },
      ],
    },
    {
      name: "Task Details",
      instructions: [
        {
          src: taskDetails,
          context: `After clicking button (1), you can duplicate the task or delete the task (3). 
              To set the execution date, press button (4), and to set the priority, press button (5). 
              If you want to include a description, use the text editor (6). You don't need to press anything to save the description, just enter it. 
              In the task duplicate window, the first thing you can do is change the task name. To do this, press the input (7) with the suggested name and change it. 
              In the include part (8), you can choose which properties of the task to duplicate. When you are done, press "Create duplicate task" (9).`,
        },
      ],
    },
  ];

  return (
    <Stack>
      <Container maxW="container.lg">
        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Heading as="h1">Atlas</Heading>
          <IconButton
            w={4}
            display={burgerButtonStyle}
            aria-label="Open burger menu"
            icon={<HamburgerIcon />}
            onClick={burgerMenuDrafter.onOpen}
          />
        </Stack>
        <Card m={2}>
          <CardBody>
            <Heading as="h2" size="lg" pt={2} pb={2}>
              Inspiration
            </Heading>
            <Text>
              While developing this application, I drew inspiration from Asana,
              a popular project management tool. My goal was to create an
              application that offers similar capabilities with my own approach,
              tailored specifically for individual users. Project Management:
              Like Asana, my application allows users to create projects that
              can be divided into sections. Sections and Tasks: Users can add
              tasks to specific sections and change their order using the drag
              and drop functionality. Tasks can have assigned dates, priorities,
              and comments. Views: The application provides two views for
              projects: a table view and a board view, allowing users to choose
              the most suitable way to manage their tasks. By drawing
              inspiration from Asana, I wanted to create a tool that is helpful
              for individual users, simplifying the process of managing their
              projects and tasks.
            </Text>
          </CardBody>
        </Card>
        <Card m={2}>
          <CardBody>
            {" "}
            <Heading as="h2" size="lg" pt={2} pb={2}>
              Technologies
            </Heading>
            <UnorderedList>
              <ListItem>
                <Stack flexDirection="row" alignItems="center" mt={1}>
                  <Image w={4} h={4} src={react} />
                  <Text>react-query: 5</Text>
                </Stack>
              </ListItem>
              <ListItem>
                <Stack flexDirection="row" alignItems="center" mt={1}>
                  <Image w={4} h={4} src={dnd} />
                  <Text>dnd-kit/core: 6</Text>
                </Stack>
              </ListItem>
              <ListItem>
                <Stack flexDirection="row" alignItems="center" mt={1}>
                  <Image w={4} h={4} src={chakraUi} />
                  <Text>chakra-ui: 2</Text>
                </Stack>
              </ListItem>
              <ListItem>
                <Stack flexDirection="row" alignItems="center" mt={1}>
                  <Image w={4} h={4} src={quill} />
                  <Text>react-quill: 2.0</Text>
                </Stack>
              </ListItem>
              <ListItem>
                <Stack flexDirection="row" alignItems="center" mt={1}>
                  <Image w={4} h={4} src={zod} />
                  <Text>zod: 3.22</Text>
                </Stack>
              </ListItem>
            </UnorderedList>
          </CardBody>
        </Card>
        <Card m={2}>
          <CardBody>
            {" "}
            <Heading as="h2" size="lg" pt={2} pb={2}>
              How to use
            </Heading>
            <Accordion defaultIndex={[0]} allowMultiple>
              {instructionData.map((item, index) => (
                <AccordionItem key={index} m={2}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Heading as="h3" size="md" pt={1} pb={1}>
                          {item.name}
                        </Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  {item.instructions.map((instruction, index) => (
                    <AccordionPanel pb={4} key={index}>
                      <Card bgColor="gray.800">
                        <CardBody>
                          <Stack divider={<StackDivider />} spacing="4">
                            <Box>
                              <InstructionCard
                                src={instruction.src}
                                context={instruction.context}
                              />
                            </Box>
                          </Stack>
                        </CardBody>
                      </Card>
                    </AccordionPanel>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      </Container>
      <MenuDrawer
        onClose={burgerMenuDrafter.onClose}
        isOpen={burgerMenuDrafter.isOpen}
      />
    </Stack>
  );
};
