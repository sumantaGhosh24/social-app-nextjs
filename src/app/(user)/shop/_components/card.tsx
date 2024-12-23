import Image from "next/image";
import Link from "next/link";

import {IProduct} from "@/models/productModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {Badge} from "@/components/ui/badge";

interface CardProps {
  product: IProduct;
}

const Card = ({product}: CardProps) => {
  const {primaryColor} = usePrimaryColor();

  return (
    <div className="relative overflow-hidden rounded-lg bg-white p-4 shadow-md dark:bg-black shadow-black dark:shadow-white">
      <Link href={`/product/details/${product._id}`}>
        <div className="overflow-hidden rounded-md">
          <Image
            src={product.image[0].url}
            alt="Card Image"
            width={250}
            height={250}
            placeholder="blur"
            blurDataURL={product.image[0].blurHash}
            priority
            className="mb-4 h-40 w-full rounded-md object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <div className="my-4 flex gap-2">
        <Badge
          className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 text-white truncate`}
        >
          ₹ {product.price}
        </Badge>
        <Badge
          className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 line-clamp-1 uppercase text-white truncate`}
        >
          {product.category.name}
        </Badge>
      </div>
      <Link href={`/product/${product._id}`}>
        <p className="mb-2 text-xl font-bold capitalize">{product.title}</p>
        <p className="mb-2 text-sm font-bold capitalize">
          {product.description}
        </p>
      </Link>
    </div>
  );
};

export default Card;
