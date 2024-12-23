"use client";

import {useRouter} from "next/navigation";
import {Pen} from "lucide-react";
import {formatDistanceToNowStrict} from "date-fns";

import {ICategory} from "@/models/categoryModel";
import {usePrimaryColor} from "@/components/primary-provider";
import Pagination from "@/components/pagination";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteCategory from "./delete-category";

interface ManageCategoriesProps {
  data: ICategory[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
  urlParamName?: string;
}

const ManageCategories = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  urlParamName,
}: ManageCategoriesProps) => {
  const {primaryColor} = usePrimaryColor();

  const router = useRouter();

  const handleUpdate = (id: string) => {
    router.push(`/categories/update/${id}`);
  };

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of all categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell className="font-medium">{cat._id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(cat.createdAt)} ago
                  </TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(cat.updatedAt)} ago
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      onClick={() => handleUpdate(cat._id)}
                      className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 mb-4 md:mr-4`}
                    >
                      <Pen size={24} className="mr-2" />
                      Update
                    </Button>
                    <DeleteCategory id={cat._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
          <h3 className="text-xl font-bold">{emptyTitle}</h3>
          <p>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default ManageCategories;
