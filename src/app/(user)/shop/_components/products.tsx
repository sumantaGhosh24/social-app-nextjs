"use client";

import {IProduct} from "@/models/productModel";
import Pagination from "@/components/pagination";

import Card from "./card";

interface ProductsProps {
  data: IProduct[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
}

const Products = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
}: ProductsProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
            {data.map((product) => {
              return <Card product={product} key={product._id} />;
            })}
          </div>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
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

export default Products;
