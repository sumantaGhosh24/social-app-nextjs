"use client";

import Image from "next/image";
import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";

import {cn} from "@/lib/utils";
import {IReview} from "@/models/reviewModel";
import {buttonVariants} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {usePrimaryColor} from "./primary-provider";
import Pagination from "./pagination";

interface ManageReviewsProps {
  data: IReview[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages?: number;
  urlParamName?: string;
  user: any;
}

const ManageReviews = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  urlParamName,
  user,
}: ManageReviewsProps) => {
  const {primaryColor} = usePrimaryColor();

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of your reviews.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">{review._id}</TableCell>
                  <TableCell>
                    <Image
                      src={review.user.profileImage.url}
                      alt={review.user.profileImage.public_id}
                      height={50}
                      width={50}
                      className="h-12 rounded"
                    />
                    <span className="capitalize">{review.user.name}</span>
                    <br />
                    {user.role === "admin" && (
                      <Link
                        href={`/reviews/user/${review.user._id}`}
                        className={cn(
                          buttonVariants(),
                          `max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`
                        )}
                      >
                        User Review
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={review.product.image[0].url}
                      alt={review.product.image[0].public_id}
                      height={50}
                      width={50}
                      className="h-12 rounded"
                    />
                    <span className="capitalize">{review.product.title}</span>
                    <br />
                    {user.role === "admin" && (
                      <Link
                        href={`/reviews/product/${review.product._id}`}
                        className={cn(
                          buttonVariants(),
                          `max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`
                        )}
                      >
                        Product Review
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="truncate">{review.comment}</TableCell>
                  <TableCell>{review.rating}</TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(review.createdAt)} ago
                  </TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(review.updatedAt)} ago
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

export default ManageReviews;
