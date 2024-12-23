import {getCategories} from "@/actions/categoryActions";
import {getProducts} from "@/actions/productActions";
import Filter from "@/components/filter";
import SearchBar from "@/components/search-bar";

import Products from "./_components/products";

export const metadata = {
  title: "Shop",
};

interface ShopProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function ShopPage({searchParams}: ShopProps) {
  const {page, query, category} = await searchParams;

  const products = await getProducts({
    searchString: (query as string) || "",
    pageNumber: Number(page) || 1,
    pageSize: 10,
    category: (category as string) || "",
  });

  const categories = await getCategories();

  return (
    <>
      <div className="my-5 p-8">
        <div className="mb-8 text-left">
          <h2 className="mb-4 text-3xl font-bold">All Products</h2>
          <p className="text-gray-600">Explore all products.</p>
        </div>
        <div className="mb-8 flex w-full flex-col gap-5 md:flex-row">
          <SearchBar placeholder="Search products" />
          <Filter categories={categories} />
        </div>
        <div>
          <Products
            data={products?.data}
            emptyTitle="No products found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={products?.totalPages}
          />
        </div>
      </div>
    </>
  );
}
