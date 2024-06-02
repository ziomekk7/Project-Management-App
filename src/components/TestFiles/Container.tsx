import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

type ContainerProps = {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem?: () => void;
};

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const { attributes, setNodeRef, listeners, transform, transition } =
    useSortable({
      id: id,
      data: {
        type: "container",
      },
    });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
    >
      <div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <button {...listeners}>drag handle</button>
      </div>
      {children}
      <button onClick={onAddItem}>add item</button>
    </div>
  );
};

export default Container;
