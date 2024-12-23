import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getUserReviews} from "@/actions/reviewActions";
import ManageReviews from "@/components/manage-reviews";

export const metadata = {
  title: "User Reviews",
};

interface UserReviewsPageProps {
  searchParams: {[key: string]: string | string[] | undefined};
  params: {id: string};
}

export default async function UserReviewsPage({
  searchParams,
  params,
}: UserReviewsPageProps) {
  const {id} = await params;
  const {page} = await searchParams;

  if (!id) redirect("/reviews");

  const reviews = await getUserReviews({
    pageNumber: Number(page) || 1,
    pageSize: 10,
    user: id,
  });

  const user = await getServerUser();

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage User Reviews</h2>
        <p className="text-gray-600">Admin manage user reviews.</p>
      </div>
      <ManageReviews
        data={reviews?.data}
        emptyTitle="No user reviews found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={reviews?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
