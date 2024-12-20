"use client";

import {ChangeEvent, Dispatch, memo, useCallback} from "react";
import {useDrop} from "react-dnd";
import update from "immutability-helper";

import InputCard from "./input-card";

interface Link {
  title: string;
  link: string;
}

interface LinksFormProps {
  links: Link[];
  setLinks: Dispatch<React.SetStateAction<Link[]>>;
  handleInputChange: (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handleAddClick: () => void;
  handleRemoveClick: (index: number) => void;
}

const LinksForm = memo(function LinksForm({
  links,
  setLinks,
  handleInputChange,
  handleAddClick,
  handleRemoveClick,
}: LinksFormProps) {
  const findLink = useCallback(
    (li: string) => {
      const link = links.filter((c) => c.link === li)[0];
      return {
        link,
        index: links.indexOf(link),
      };
    },
    [links]
  );

  const moveLink = useCallback(
    (li: string, atIndex: number) => {
      const {link, index} = findLink(li);
      setLinks(
        update(links, {
          $splice: [
            [index, 1],
            [atIndex, 0, link],
          ],
        })
      );
    },
    [findLink, links, setLinks]
  );

  const [, drop] = useDrop(() => ({accept: "link"}));

  return (
    <>
      <div className="flex flex-col w-full gap-3" ref={drop as any}>
        <label className="text-base font-semibold">User Links</label>
        {links.map((input, i) => (
          <InputCard
            key={i}
            i={i}
            link={input?.link}
            moveLink={moveLink}
            findLink={findLink}
            input={input}
            links={links}
            handleInputChange={handleInputChange}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
          />
        ))}
      </div>
    </>
  );
});

export default LinksForm;
