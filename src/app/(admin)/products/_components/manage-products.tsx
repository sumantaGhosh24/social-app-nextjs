"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {Eye, Pen} from "lucide-react";
import {formatDistanceToNowStrict} from "date-fns";

import {IProduct} from "@/models/productModel";
import {usePrimaryColor} from "@/components/primary-provider";
import Pagination from "@/components/pagination";
import DialogProvider from "@/components/dialog-provider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {Button} from "@/components/ui/button";

import DeleteProduct from "./delete-product";

interface ManageProductsProps {
  data: IProduct[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
  urlParamName?: string;
}

const ManageProducts = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  urlParamName,
}: ManageProductsProps) => {
  const {primaryColor} = usePrimaryColor();

  const router = useRouter();

  const handleUpdate = (id: string) => {
    router.push(`/products/update/${id}`);
  };

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product._id}</TableCell>
                  <TableCell>
                    <DialogProvider
                      trigger={
                        <Button
                          className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
                        >
                          View Owner
                        </Button>
                      }
                      title="Product Owner Details"
                    >
                      <Image
                        src={product.owner.profileImage.url}
                        alt={product.owner.profileImage.public_id}
                        height={250}
                        width={500}
                        className="h-[250px] w-full rounded"
                      />
                      <h3 className="text-xl font-bold capitalize my-3">
                        {product.owner.name}
                      </h3>
                      <h4>{product.owner.email}</h4>
                    </DialogProvider>
                  </TableCell>
                  <TableCell className="truncate">{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <DialogProvider
                      trigger={
                        <Image
                          src={product.image[0].url}
                          alt={product.image[0].public_id}
                          placeholder="blur"
                          blurDataURL={product.image[0].blurHash}
                          priority
                          height={50}
                          width={50}
                          className="h-12 w-12 animate-pulse cursor-pointer rounded"
                        />
                      }
                      title="Product Images"
                    >
                      <Carousel>
                        <CarouselContent>
                          {product.image.map((img) => (
                            <CarouselItem key={img.public_id}>
                              <Image
                                src={img.url}
                                alt={img.public_id}
                                height={250}
                                width={500}
                                className="h-[250px] w-full rounded"
                                placeholder="blur"
                                blurDataURL={img.blurHash}
                                priority
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </DialogProvider>
                  </TableCell>
                  <TableCell>
                    <h3 className="capitalize">{product.category.name}</h3>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(product.createdAt)} ago
                  </TableCell>
                  <TableCell className="truncate">
                    {formatDistanceToNowStrict(product.updatedAt)} ago
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      onClick={() => handleUpdate(product._id)}
                      className="max-w-fit bg-green-700 hover:bg-green-800 disabled:bg-green-300 mb-4 md:mr-4"
                    >
                      <Pen size={24} className="mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="default"
                      onClick={() =>
                        router.push(`/product/details/${product._id}`)
                      }
                      className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 mb-4 md:mr-4`}
                    >
                      <Eye size={24} className="mr-2" />
                      View
                    </Button>
                    <DeleteProduct id={product._id} />
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

export default ManageProducts;
