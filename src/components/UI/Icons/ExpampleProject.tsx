import { TaskPriority } from "../../../types/types";

export const exampleProject = {
  name: "Corporate Event Planning",
  sections: [
    {
      name: "Planning",
      id: "section1",
      tasks: [
        {
          name: "Choose the event date",
          id: "task1",
          date: new Date("2024-09-01"),
          priority: TaskPriority.MEDIUM,
          description: "Select a convenient date for all participants.",
        },
        {
          name: "Create a guest list",
          id: "task2",
          date: new Date("2024-09-03"),
          priority: TaskPriority.HIGH,
          description: "Prepare a list of all invited attendees.",
        },
        {
          name: "Find a venue for the event",
          id: "task3",
          date: new Date("2024-09-05"),
          priority: TaskPriority.MEDIUM,
          description:
            "Review available venues and choose the best location for the event.",
        },
      ],
    },
    {
      name: "Organization",
      id: "section2",
      tasks: [
        {
          name: "Order catering",
          id: "task4",
          date: new Date("2024-09-07"),
          priority: TaskPriority.MEDIUM,
          description: "Select a catering service and order food and drinks.",
        },
        {
          name: "Arrange audio-visual equipment",
          id: "task5",
          date: new Date("2024-09-09"),
          priority: TaskPriority.LOW,
          description: "Book and set up equipment needed for presentations.",
        },
        {
          name: "Prepare promotional materials",
          id: "task6",
          date: new Date("2024-09-11"),
          priority: TaskPriority.MEDIUM,
          description: "Create and print flyers and posters.",
        },
      ],
    },
    {
      name: "Summary",
      id: "section3",
      tasks: [
        {
          name: "Conduct event evaluation survey",
          id: "task7",
          date: new Date("2024-09-13"),
          priority: TaskPriority.MEDIUM,
          description: "Create a survey and ask participants to fill it out.",
        },
        {
          name: "Analyze participant feedback",
          id: "task8",
          date: new Date("2024-09-15"),
          priority: TaskPriority.MEDIUM,
          description: "Gather and analyze survey responses.",
        },
        {
          name: "Compile a final report",
          id: "task9",
          date: new Date("2024-09-17"),
          priority: TaskPriority.HIGH,
          description:
            "Prepare a summary report of the event results and discuss it with the team.",
        },
      ],
    },
  ],
  id: "project1",
};
