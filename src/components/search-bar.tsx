"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState, useEffect} from "react";
import {SearchIcon} from "lucide-react";

import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils";

import {Input} from "./ui/input";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar = ({placeholder}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }
      router.push(newUrl, {scroll: false});
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <>
      <div className="flex min-h-[54px] w-full items-center justify-center overflow-hidden rounded-full bg-gray-200 px-4 py-2">
        <SearchIcon size={24} className="text-black" />
        <Input
          type="text"
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 bg-gray-200 outline-offset-0 placeholder:text-gray-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
        />
      </div>
    </>
  );
};

export default SearchBar;
