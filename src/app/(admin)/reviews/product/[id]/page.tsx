import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getProductReviews} from "@/actions/reviewActions";
import ManageReviews from "@/components/manage-reviews";

export const metadata = {
  title: "Product Reviews",
};

interface ProductReviewsPageProps {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
  params: Promise<{id: string}>;
}

export default async function ProductReviewsPage({
  searchParams,
  params,
}: ProductReviewsPageProps) {
  const {id} = await params;
  const {page} = await searchParams;

  if (!id) redirect("/reviews");

  const reviews = await getProductReviews({
    pageNumber: Number(page) || 1,
    pageSize: 50,
    product: id,
  });

  const user = await getServerUser();

  return (
    <div className="mx-auto my-10 container rounded p-8 shadow dark:shadow-gray-400">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage Product Reviews</h2>
        <p className="text-gray-600">Admin manage product reviews.</p>
      </div>
      <ManageReviews
        data={reviews?.data}
        emptyTitle="No product reviews found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={reviews?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
