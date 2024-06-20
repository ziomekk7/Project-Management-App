import { DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { Project, Section, Task } from "../../types/types";
// import {
//   ChangeSectionLocationData,
//   ChangeTaskLocationData,
// } from "../../api/projectsApi";

export const useDndProject = (projectToUpdate: Project | null | undefined) => {
  const [project, setProject] = useState<Project | null | undefined>(
    projectToUpdate
  );
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log(active, "active");
    if (active.data.current?.type === "section") {
      setActiveSection(active.data.current?.section);
    }
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current?.task);
    }
  };

  const handleDragEnd = () => {
    setActiveSection(null);
    setActiveTask(null);
    // const source = event.active;
    // const destination = event.over;

    // if (
    //   !project ||
    //   !source.data.current ||
    //   !destination ||
    //   !destination.data.current
    // ) {
    //   return;
    // }

    // if (source.id === destination.id) {
    //   return;
    // }

    // const sourceType = source.data.current.type;
    // const destinationType = destination.data.current.type;
    // const findDestinationSectionIdexByTaskId = (destinationTaskId: string) => {
    //   const destinationSectionIndex = project.sections.findIndex((section) =>
    //     section.tasks.find((task) => task.id === destinationTaskId)
    //   );
    //   return destinationSectionIndex;
    // };
    // const findDestinationSectionIndexBySectionId = (
    //   destinationSectionId: string
    // ) => {
    //   const destinationSectionIndex = project.sections.findIndex(
    //     (section) => destinationSectionId === section.id
    //   );
    //   return destinationSectionIndex;
    // };

    // const updatedProjectSectionMove = (data: ChangeSectionLocationData) => {
    //   const movedSectionIndex = project.sections.findIndex(
    //     (section) => section.id === data.sectionId
    //   );
    //   const updateSections = arrayMove(
    //     project.sections,
    //     movedSectionIndex,
    //     data.destination
    //   );
    //   const updatedProject: Project = { ...project, sections: updateSections };
    //   return { project: updatedProject, type: source.data.current?.type };
    // };

    // const updatedProjectTaskMove = (data: ChangeTaskLocationData) => {
    //   const projectToChange: Project = {
    //     ...project,
    //     sections: project.sections.map((section) => ({
    //       ...section,
    //       tasks: section.tasks.map((task) => ({ ...task })),
    //     })),
    //   };
    //   const sectionIndex = project.sections.findIndex((section) =>
    //     section.tasks.find((task) => task.id === data.taskId)
    //   );
    //   const sectionDestinationIndex = project.sections.findIndex(
    //     (section) => section.id === data.destinationSectionId
    //   );
    //   const taskIndex = project.sections[sectionIndex].tasks.findIndex(
    //     (task) => task.id === data.taskId
    //   );
    //   const task = projectToChange.sections[sectionIndex].tasks[taskIndex];
    //   projectToChange.sections[sectionIndex].tasks.splice(taskIndex, 1);
    //   projectToChange.sections[sectionDestinationIndex].tasks.splice(
    //     data.destinationIndex,
    //     0,
    //     task
    //   );
    //   return { project: projectToChange, type: source.data.current?.type };
    // };

    // if (sourceType === "section") {
    //   const sourceSectionId = source.id;
    //   if (destinationType === "task") {
    //     const data = {
    //       sectionId: sourceSectionId.toLocaleString(),
    //       destination: findDestinationSectionIdexByTaskId(
    //         destination.id.toLocaleString()
    //       ),
    //       type: "section",
    //     };
    //     return updatedProjectSectionMove(data);
    //   } else if (destinationType === "section") {
    //     const destinationSectionIndex = findDestinationSectionIndexBySectionId(
    //       destination.id.toLocaleString()
    //     );
    //     const data = {
    //       sectionId: sourceSectionId.toLocaleString(),
    //       destination: destinationSectionIndex,
    //       type: "section",
    //     };
    //     return updatedProjectSectionMove(data);
    //   }
    // } else if (sourceType === "task") {
    //   const sourceTaskId = source.id.toLocaleString();

    //   if (destinationType == "task") {
    //     const destinationTaskId = destination.id;
    //     const destinationSectionIndex = findDestinationSectionIdexByTaskId(
    //       destination.id.toLocaleString()
    //     );
    //     const destinationTaskIndex = project.sections[
    //       destinationSectionIndex
    //     ].tasks.findIndex((task) => task.id === destinationTaskId);

    //     const destinationSection = project.sections[destinationSectionIndex];
    //     const data = {
    //       taskId: sourceTaskId,
    //       destinationSectionId: destinationSection.id,
    //       destinationIndex: destinationTaskIndex,
    //     };

    //     return updatedProjectTaskMove(data);
    //   }
    // }
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over || !project) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "task" && overType === "task") {
      const activeTask = active.data.current?.task;
      const overTask = over.data.current?.task;
      if (!activeTask || !overTask) return;

      const activeSectionIndex = project.sections.findIndex((section) =>
        section.tasks.some((task) => task.id === activeTask.id)
      );
      const overSectionIndex = project.sections.findIndex((section) =>
        section.tasks.some((task) => task.id === overTask.id)
      );

      if (activeSectionIndex === -1 || overSectionIndex === -1) return;

      const activeSection = project.sections[activeSectionIndex];
      const overSection = project.sections[overSectionIndex];

      const activeTaskIndex = activeSection.tasks.findIndex(
        (task) => task.id === activeId
      );
      const overTaskIndex = overSection.tasks.findIndex(
        (task) => task.id === overId
      );

      if (activeTaskIndex === -1 || overTaskIndex === -1) return;

      const updatedSections = [...project.sections];

      if (activeSectionIndex !== overSectionIndex) {
        const taskToMove = activeSection.tasks.splice(activeTaskIndex, 1)[0];
        overSection.tasks.splice(overTaskIndex, 0, taskToMove);

        updatedSections[activeSectionIndex] = { ...activeSection };
        updatedSections[overSectionIndex] = { ...overSection };
      } else {
        const updatedTasks = arrayMove(
          activeSection.tasks,
          activeTaskIndex,
          overTaskIndex
        );
        updatedSections[activeSectionIndex] = {
          ...activeSection,
          tasks: updatedTasks,
        };
      }

      setProject({ ...project, sections: updatedSections });
    }
  };

  // const handleDragOver = (event: DragOverEvent) => {
  //   const { over, active } = event;
  //   if (!over || !project) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   const activeType = active.data.current?.type;
  //   const overType = over.data.current?.type;

  //   if (activeType === "task" && overType === "task") {
  //     const activeTask = active.data.current?.task;
  //     const overTask = over.data.current?.task;
  //     if (!activeTask || !overTask) return;

  //     const activeSectionIndex = project.sections.findIndex((section) =>
  //       section.tasks.find((task) => task.id === activeTask.id)
  //     );
  //     const overSectionIndex = project.sections.findIndex((section) =>
  //       section.tasks.find((task) => task.id === overTask.id)
  //     );

  //     if (activeSectionIndex === -1 || overSectionIndex === -1) return;

  //     const updatedSections = [...project.sections];

  //     const activeSection = project.sections[activeSectionIndex];
  //     const overSection = project.sections[overSectionIndex];

  //     const activeTaskIndex = activeSection.tasks.findIndex(
  //       (task) => task.id === activeId
  //     );
  //     const overTaskIndex = overSection.tasks.findIndex(
  //       (task) => task.id === overId
  //     );
  //     console.log(overSection.tasks.find((task) => task.id === overId));

  //     // console.log(activeTask,"activeTask", overTask, "overTask")
  //     console.log(activeTask.name, activeTaskIndex, "activeTask");
  //     console.log(overTask.name, overTaskIndex, "overTask");

  //     if (activeTaskIndex === -1 || overTaskIndex === -1) return;

  //     if (activeSection !== overSection) {
  //       const taskToMove = activeSection.tasks.splice(activeTaskIndex, 1)[0];
  //       overSection.tasks.splice(overTaskIndex, 0, {
  //         ...taskToMove,
  //       });

  //       updatedSections[activeSectionIndex] = activeSection;
  //       updatedSections[overSectionIndex] = overSection;
  //     } else {
  //       const updatedTasks = arrayMove(
  //         activeSection.tasks,
  //         activeTaskIndex,
  //         overTaskIndex
  //       );
  //       updatedSections[activeSectionIndex] = {
  //         ...activeSection,
  //         tasks: updatedTasks,
  //       };
  //     }

  //     setProject({ ...project, sections: updatedSections });
  //   }
  // };

  return {
    project,
    handleDragOver,
    handleDragStart,
    handleDragEnd,
    activeSection,
    activeTask,
  };
};
