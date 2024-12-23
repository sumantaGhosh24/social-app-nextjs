import Link from "next/link";

import {getAllCategories} from "@/actions/categoryActions";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import SearchBar from "@/components/search-bar";

import ManageCategories from "./_components/manage-categories";

export const metadata = {
  title: "Manage Categories",
};

interface ManageCategoriesProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function ManageCategoriesPage({
  searchParams,
}: ManageCategoriesProps) {
  const {page, query} = await searchParams;

  const categories = await getAllCategories({
    searchString: (query as string) || "",
    pageNumber: Number(page) || 1,
    pageSize: 10,
  });

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="flex justify-between">
        <div className="mb-8 text-left">
          <h2 className="mb-4 text-3xl font-bold">Manage Categories</h2>
          <p className="text-gray-600">Admin manage all categories.</p>
        </div>
        <Link
          href="/categories/create"
          className={cn(buttonVariants(), "bg-blue-700 hover:bg-blue-800")}
        >
          Create Category
        </Link>
      </div>
      <div className="mb-8">
        <SearchBar placeholder="Search categories" />
      </div>
      <ManageCategories
        data={categories?.data}
        emptyTitle="No category found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={categories?.totalPages}
      />
    </div>
  );
}
