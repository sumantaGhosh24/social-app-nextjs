import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getProduct} from "@/actions/productActions";
import {getProductReviews} from "@/actions/reviewActions";

import ProductDetails from "./_components/product-details";
import CreateReviewForm from "./_components/create-review-form";
import ProductReviews from "./_components/product-reviews";

export const metadata = {
  title: "Product",
};

interface ProductDetailsPageProps {
  params: {id: string};
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const {id} = await params;
  const {page} = await searchParams;

  const product = await getProduct(id);

  if (!product) redirect("/");

  const user = await getServerUser();

  const reviews = await getProductReviews({
    pageNumber: Number(page) || 1,
    pageSize: 5,
    product: product._id,
  });

  return (
    <>
      <ProductDetails product={product} />
      <CreateReviewForm
        product={product}
        user={JSON.parse(JSON.stringify(user))}
      />
      <ProductReviews
        data={reviews?.data}
        emptyTitle="No review found"
        emptyStateSubtext="Try again later"
      />
    </>
  );
}
