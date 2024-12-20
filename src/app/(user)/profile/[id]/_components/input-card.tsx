"use client";

import {ChangeEvent, memo} from "react";
import {useDrag, useDrop, DragSourceMonitor} from "react-dnd";
import {Menu} from "lucide-react";

import {usePrimaryColor} from "@/components/primary-provider";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface Link {
  title: string;
  link: string;
}

interface InputCardProps {
  input: Link;
  links: Link[];
  handleInputChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handleAddClick: () => void;
  handleRemoveClick: (index: number) => void;
  link: string;
  moveLink: (link: string, atIndex: number) => void;
  findLink: (link: string) => {link: Link; index: number};
  i: number;
}

const InputCard = memo(function InputCard({
  input,
  links,
  handleInputChange,
  handleAddClick,
  handleRemoveClick,
  link,
  moveLink,
  findLink,
  i,
}: InputCardProps) {
  const {primaryColor} = usePrimaryColor();

  const originalIndex = findLink(link).index;

  const [{isDragging}, drag] = useDrag(
    () => ({
      type: "link",
      item: {link, originalIndex},
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const {link: droppedId, originalIndex} = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveLink(droppedId, originalIndex);
        }
      },
    }),
    [link, originalIndex, moveLink]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "link",
      hover({link: draggedId}: {link: string}) {
        if (draggedId !== link) {
          const {index: overIndex} = findLink(link);
          moveLink(draggedId, overIndex);
        }
      },
    }),
    [findLink, moveLink]
  );

  const opacity = isDragging ? 0 : 1;

  return (
    <>
      <div
        className="flex gap-2 items-center"
        ref={(node) => drag(drop(node)) as any}
        style={{opacity: opacity}}
      >
        <Menu
          size={36}
          className="cursor-grab rounded-full text-black dark:text-white"
        />
        <Input
          type="text"
          className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
          placeholder="Link title"
          name="title"
          value={input.title}
          onChange={(event) => handleInputChange(i, event)}
        />
        <Input
          type="text"
          className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-black"
          placeholder="Link href"
          name="link"
          value={input.link}
          onChange={(event) => handleInputChange(i, event)}
        />
        {links.length !== 1 && (
          <Button
            type="button"
            onClick={() => handleRemoveClick(i)}
            className="max-w-fit bg-rose-700 hover:bg-rose-800"
          >
            Remove
          </Button>
        )}
        {links.length - 1 === i && (
          <Button
            type="button"
            onClick={handleAddClick}
            className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800`}
          >
            Add
          </Button>
        )}
      </div>
    </>
  );
});

export default InputCard;
