import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  // DragOverlay,
  // DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import Container from "./Container";
import Items from "./Items";
import { v4 as uuidv4 } from "uuid";
import { Flex } from "@chakra-ui/react";

type DndType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};
const MainTest = () => {
  const [containers, setContainers] = useState<DndType[]>([
    {
      id: uuidv4(),
      title: "container 1",
      items: [
        { id: uuidv4(), title: "item1" },
        { id: uuidv4(), title: "item2" },
      ],
    },
    {
      id: uuidv4(),
      title: "container 2",
      items: [
        { id: uuidv4(), title: "item12" },
        { id: uuidv4(), title: "item22" },
      ],
    },
  ]);
  // const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // const [currentContainerId, setCurrentContainerId] =
  //   useState<UniqueIdentifier>();
  // const [containerName, setContainerName] = useState("");
  // const [itemName, setItemName] = useState("");
  // const [showAddContainerModal, setShowAddContainerModal] = useState(false);
  // const [showAddItemModal, setShowAddModal] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  if (!containers) {
    return;
  }
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers?.find((item) => item.id === id);
    }
    if (type === "item") {
      return containers?.find((container) =>
        container.items.find((item) => item.id === id)
      );
    }
  }
  // const findItemTitle = (id: UniqueIdentifier | undefined) => {
  //   const container = findValueOfItems(id, "item");
  //   if (!container) return "";
  //   const item = container.items.find((item) => item.id === id);
  //   if (!item) return "";
  //   return item.title;
  // };

  // const findContainerTitle = (id: UniqueIdentifier | undefined) => {
  //   const container = findValueOfItems(id, "container");
  //   if (!container) return "";
  //   return container.title;
  // };
  // const findContainerItems = (id: UniqueIdentifier | undefined) => {
  //   const container = findValueOfItems(id, "container");
  //   if (!container) return [];
  //   return container.items;
  // };
  // const handleDragStart = (event: DragStartEvent) => {
  //   const { active } = event;
  //   const { id } = active;
  //   console.log("first");
  //   setActiveId(id);
  // };
  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers?.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers?.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );

        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      // Remove the active item from the active container and add it to the over container
      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("test11");
    console.log(active.data.current);
    // Handling Container Sorting
    if (
      active.data.current?.type.includes("container") &&
      over?.data.current?.type.includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      console.log("test12");
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id
      );
      // Swap the active and over container
      // projects[projectIndex].sections.splice(sectionIndex, 1);
      // projects[projectIndex].sections.splice(data.destination, 0, section);
      console.log("test");
      const newItems = [...containers];
      newItems.splice(activeContainerIndex, 1);
      newItems.splice(overContainerIndex, 0, containers[activeContainerIndex]);
      console.log("test2");
      console.log(newItems);
      // newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }
    console.log("test300");

    // Handling item Sorting
    if (
      active.data.current?.type.includes("item") &&
      over?.data.current?.type.includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "item");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        );
        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item");
      const overContainer = findValueOfItems(over.id, "container");

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );

      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    // setActiveId(null);
  };

  return (
    <>
      <div>MainTest</div>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          // onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {containers ? (
            <SortableContext
              items={containers.map((container) => container.id)}
            >
              <Flex>
                {containers.map((container) => (
                  <Container
                    key={container.id}
                    title={container.title}
                    id={container.id}
                    // onAddItem={() => {
                    //   setShowAddModal(true);
                    //   setCurrentContainerId(container.id);
                    // }}
                  >
                    <SortableContext
                      items={container.items.map((item) => item.id)}
                    >
                      {container.items.map((item) => (
                        <Items key={item.id} id={item.id} title={item.title} />
                      ))}
                    </SortableContext>
                  </Container>
                ))}
              </Flex>
            </SortableContext>
          ) : null}
          {/* <DragOverlay adjustScale={false}> */}
          {/* Drag Overlay For item Item */}
          {/* {activeId && activeId.toString().includes("item") && ( */}
          {/* <Items id={activeId} title={findItemTitle(activeId)} /> */}
          {/* )} */}
          {/* Drag Overlay For Container */}
          {/* {activeId && activeId.toString().includes("container") && ( */}
          {/* <Container id={activeId} title={findContainerTitle(activeId)}> */}
          {/* {findContainerItems(activeId).map((i) => ( */}
          {/* <Items key={i.id} title={i.title} id={i.id} /> */}
          {/* ))} */}
          {/* </Container> */}
          {/* )} */}
          {/* </DragOverlay> */}
        </DndContext>
      </div>
    </>
  );
};

export default MainTest;
