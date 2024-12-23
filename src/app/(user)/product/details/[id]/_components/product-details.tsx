"use client";

import {useState} from "react";
import Image from "next/image";
import {ShoppingCart} from "lucide-react";
import {formatDistanceToNowStrict} from "date-fns";

import {addCart} from "@/actions/cartActions";
import {IProduct} from "@/models/productModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailsProps {
  product: IProduct;
}

const ProductDetails = ({product}: ProductDetailsProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const addToCart = async () => {
    setLoading(true);
    try {
      await addCart({productId: product._id, quantity: 1, path: "/cart"});

      toast({description: "Product added to cart!"});
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
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <div className="mb-5 md:mb-0">
          <h2 className="text-3xl font-bold capitalize">{product.title}</h2>
          <h3 className="mt-5 text-xl capitalize">{product.description}</h3>
        </div>
        <div className="mx-auto w-[90%]">
          <Carousel>
            <CarouselContent>
              {product.image.map((img: any) => (
                <CarouselItem key={img.public_id}>
                  <Image
                    src={img.url}
                    alt={img.public_id}
                    height={250}
                    width={500}
                    className="h-[350px] w-full rounded"
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
        </div>
        <p className="text-lg first-letter:capitalize">{product.content}</p>
        <h4 className="flex gap-1 items-center">
          <span className="text-xl font-bold">Price:</span>
          <span className="font-bold">{product.price}</span>
        </h4>
        <Button
          type="button"
          disabled={loading}
          className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          onClick={() => addToCart()}
        >
          <ShoppingCart />
          {loading ? "Processing..." : "Add Cart"}
        </Button>
        <div className="flex items-center gap-3 rounded border border-primary p-5 w-fit">
          <h4>Category: </h4>
          <h4>{product.category.name}</h4>
        </div>
        <div className="flex items-center justify-between">
          <h4>
            Created at: {formatDistanceToNowStrict(product.createdAt)} ago
          </h4>
          <h4>
            Updated at: {formatDistanceToNowStrict(product.updatedAt)} ago
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
