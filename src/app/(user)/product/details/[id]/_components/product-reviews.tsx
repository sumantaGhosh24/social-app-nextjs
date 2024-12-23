"use client";

import {formatDistanceToNowStrict} from "date-fns";
import {Star} from "lucide-react";

import {IReview} from "@/models/reviewModel";
import {Card} from "@/components/ui/card";
import {Avatar, AvatarImage} from "@/components/ui/avatar";

interface ProductReviewsProps {
  data: IReview[];
  emptyTitle: string;
  emptyStateSubtext: string;
}

const ProductReviews = ({
  data,
  emptyTitle,
  emptyStateSubtext,
}: ProductReviewsProps) => {
  return (
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <h1 className="mb-5 text-2xl font-bold">All Reviews</h1>
        {data.length > 0 ? (
          <div>
            {data.map((review) => (
              <Card key={review._id} className="mb-5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.profileImage.url} />
                  </Avatar>
                  <div>
                    <h3 className="capitalize">{review.user.name}</h3>
                    <h4>{review.user.email}</h4>
                  </div>
                  <p className="ml-auto">
                    {formatDistanceToNowStrict(review.createdAt)} ago
                  </p>
                </div>
                <div>
                  <p className="mb-4">{review.comment}</p>
                  <div className="flex gap-3">
                    {Array.from(
                      {length: parseInt(review.rating as any)},
                      () => 1
                    ).map((_, i) => (
                      <Star key={i} color="orange" fill="orange" />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
            <h3 className="text-xl font-bold">{emptyTitle}</h3>
            <p>{emptyStateSubtext}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
