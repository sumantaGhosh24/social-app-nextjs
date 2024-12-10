"use client";

import {useRouter, useSearchParams} from "next/navigation";

import {formUrlQuery} from "@/lib/utils";

import {usePrimaryColor} from "./primary-provider";
import {Button} from "./ui/button";

interface PaginationProps {
  page?: number;
  totalPages: number;
  urlParamName?: string;
}

const Pagination = ({page, totalPages, urlParamName}: PaginationProps) => {
  const {primaryColor} = usePrimaryColor();

  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl, {scroll: false});
  };

  const handleClick = (num: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: num.toString(),
    });
    router.push(newUrl, {scroll: false});
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className={`w-28 bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 text-white`}
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      {[...Array(totalPages)].fill(0).map((_, i) => (
        <Button
          key={i}
          onClick={() => handleClick(i + 1)}
          className={`${
            page === i + 1
              ? `bg-${primaryColor}-700 hover:bg-${primaryColor}-800`
              : "text-white"
          }`}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        size="lg"
        variant="outline"
        className={`w-28 bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 text-white`}
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
