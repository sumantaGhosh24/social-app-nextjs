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
    <div className="container mx-auto my-10 space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
      <div className="grid gap-10 md:grid-cols-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl">
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product.image.map((img: any) => (
                <CarouselItem key={img.public_id}>
                  <Image
                    src={img.url}
                    alt={img.public_id}
                    height={400}
                    width={600}
                    className="h-[400px] w-full object-cover rounded-xl"
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
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="mt-2 text-gray-500">{product.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-gray-500">Price</span>
            <span className="text-3xl font-bold text-primary">
              ${product.price}
            </span>
          </div>
          <Button
            type="button"
            disabled={loading}
            onClick={() => addToCart()}
            className={`w-full md:w-fit flex items-center gap-2 px-6 py-5 text-lg bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          >
            <ShoppingCart size={20} />
            {loading ? "Processing..." : "Add to Cart"}
          </Button>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold">Category:</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
              {product.category.name}
            </span>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.content}
            </p>
          </div>
          <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
            <span>
              Created {formatDistanceToNowStrict(product.createdAt)} ago
            </span>
            <span>
              Updated {formatDistanceToNowStrict(product.updatedAt)} ago
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
