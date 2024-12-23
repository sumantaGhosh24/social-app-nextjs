"use client";

import {useState} from "react";
import {Trash} from "lucide-react";

import {clearCart} from "@/actions/cartActions";
import {ICart} from "@/models/cartModel";
import {useToast} from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import Cart from "./cart";

interface ManageCartProps {
  cart: ICart;
}

const ManageCart = ({cart}: ManageCartProps) => {
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart("/cart");
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
    <section className="p-6 shadow-xl rounded-xl w-full">
      <h1 className="text-3xl font-bold capitalize mb-10">My Cart</h1>
      {cart && cart.products && cart.products.length > 0 ? (
        <div className="relative overflow-x-auto mt-10">
          <Table>
            <TableCaption>A list of products in your cart.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Decrement</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Increment</TableHead>
                <TableHead>Remove</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tax Price</TableHead>
                <TableHead>Shipping Price</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart?.products?.map((product, ind) => (
                <Cart product={product} ind={ind + 1} key={ind} />
              ))}
            </TableBody>
          </Table>
          <Button
            type="button"
            disabled={loading}
            className="bg-red-700 hover:bg-red-800 disabled:bg-red-300"
            onClick={handleClearCart}
          >
            <Trash /> Clear Cart
          </Button>
        </div>
      ) : (
        <h3 className="text-xl capitalize mb-10">
          Your cart is empty, add a product to see your cart.
        </h3>
      )}
    </section>
  );
};

export default ManageCart;
