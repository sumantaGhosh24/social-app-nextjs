"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {Trash} from "lucide-react";

import {deleteProductImage} from "@/actions/productActions";
import {IProduct} from "@/models/productModel";
import {useToast} from "@/hooks/use-toast";
import {Card, CardContent} from "@/components/ui/card";

interface RemoveProductImageProps {
  product: IProduct;
}

const RemoveProductImage = ({product}: RemoveProductImageProps) => {
  const [files, setFiles] = useState(product.image);
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const path = usePathname();

  const handleDelete = async (publicId: string) => {
    setLoading(true);
    try {
      setFiles((files) => files.filter((file) => file.public_id !== publicId));

      await deleteProductImage({
        id: product._id,
        public_id: publicId,
        path,
      });

      toast({title: "Image removed!", description: "Product image removed!"});
    } catch (error: any) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center my-10">
      <div className="min-w-[80%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <div className="flex flex-col justify-start gap-5">
          <h1 className="mb-5 text-2xl font-bold">Remove Product Image</h1>
          {loading && (
            <h2 className="my-5 text-center text-lg font-bold text-red-700">
              Deleting image...
            </h2>
          )}
          <div className="mb-5 flex flex-wrap items-start gap-2">
            {files.map((file, i) => (
              <Card className="relative mx-auto mb-5 !max-h-fit" key={i}>
                <CardContent className="p-0">
                  <Image
                    src={file.url}
                    alt={file.public_id}
                    width={250}
                    height={250}
                    placeholder="blur"
                    blurDataURL={file.blurHash}
                    priority
                    className="h-40 rounded-md object-cover transition-transform hover:scale-105"
                  />
                  <Trash
                    className="absolute right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-gray-200 p-1 text-red-700 transition-all hover:bg-red-700 hover:text-gray-200"
                    onClick={() => handleDelete(file.public_id)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductImage;
