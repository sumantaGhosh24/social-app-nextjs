import getServerUser from "@/actions/getServerUser";
import {getAllReviews} from "@/actions/reviewActions";
import ManageReviews from "@/components/manage-reviews";

export const metadata = {
  title: "Manage Reviews",
};

interface ManageReviewsPageProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function ManageReviewsPage({
  searchParams,
}: ManageReviewsPageProps) {
  const {page} = await searchParams;

  const reviews = await getAllReviews({
    pageNumber: Number(page) || 1,
    pageSize: 10,
  });

  const user = await getServerUser();

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage Reviews</h2>
        <p className="text-gray-600">Admin manage all reviews.</p>
      </div>
      <ManageReviews
        data={reviews?.data}
        emptyTitle="No reviews found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={reviews?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
