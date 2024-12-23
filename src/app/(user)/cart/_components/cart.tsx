"use state";

import {useState} from "react";
import Image from "next/image";
import {MinusCircle, PlusCircle, XCircle} from "lucide-react";

import {addCart, removeCart} from "@/actions/cartActions";
import {formatFloatingNumber} from "@/lib/utils";
import {IProduct} from "@/models/productModel";
import {usePrimaryColor} from "@/components/primary-provider";
import {useToast} from "@/hooks/use-toast";
import DialogProvider from "@/components/dialog-provider";
import {Button} from "@/components/ui/button";
import {TableCell, TableRow} from "@/components/ui/table";

interface CartProps {
  product: {
    product: IProduct;
    quantity: number;
    price: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  };
  ind: number;
}

const Cart = ({product, ind}: CartProps) => {
  const [loading, setLoading] = useState(false);

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const handleDecrement = async () => {
    setLoading(true);
    try {
      if (product.quantity <= 1) {
        await removeCart({productId: product.product._id, path: "/cart"});
      } else {
        await addCart({
          productId: product.product._id,
          quantity: product.quantity - 1,
          path: "/cart",
        });
      }
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

  const handleIncrement = async () => {
    setLoading(true);
    try {
      await addCart({
        productId: product.product._id,
        quantity: product.quantity + 1,
        path: "/cart",
      });
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

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeCart({productId: product.product._id, path: "/cart"});
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
    <TableRow>
      <TableCell className="font-medium">{ind}</TableCell>
      <TableCell>
        <DialogProvider
          trigger={
            <Image
              src={product?.product?.image[0].url}
              alt={product?.product?.image[0].public_id}
              placeholder="blur"
              blurDataURL={product?.product?.image[0].blurHash}
              priority
              height={50}
              width={50}
              className="h-12 animate-pulse cursor-pointer"
            />
          }
          title="Product Image"
        >
          <div>
            <Image
              src={product?.product?.image[0].url}
              alt={product?.product?.image[0].public_id}
              placeholder="blur"
              blurDataURL={product?.product?.image[0].blurHash}
              priority
              height={200}
              width={500}
              className="h-[200px] w-full rounded"
            />
            <p className="text-lg mt-4 capitalize">{product?.product?.title}</p>
          </div>
        </DialogProvider>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          size="icon"
          disabled={loading}
          className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          onClick={handleDecrement}
        >
          <MinusCircle />
        </Button>
      </TableCell>
      <TableCell>{product.quantity}</TableCell>
      <TableCell>
        <Button
          type="button"
          size="icon"
          disabled={loading}
          className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          onClick={handleIncrement}
        >
          <PlusCircle />
        </Button>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          size="icon"
          disabled={loading}
          className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
          onClick={handleRemove}
        >
          <XCircle />
        </Button>
      </TableCell>
      <TableCell>{formatFloatingNumber(product.price)}</TableCell>
      <TableCell>{formatFloatingNumber(product.taxPrice)}</TableCell>
      <TableCell>{formatFloatingNumber(product.shippingPrice)}</TableCell>
      <TableCell>{formatFloatingNumber(product.totalPrice)}</TableCell>
    </TableRow>
  );
};

export default Cart;
