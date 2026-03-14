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
    <section className="p-6 shadow-md rounded-md w-full dark:shadow-gray-400">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
        {cart?.products?.length > 0 && (
          <Button
            type="button"
            disabled={loading}
            onClick={handleClearCart}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <Trash size={18} />
            Clear Cart
          </Button>
        )}
      </div>
      {cart?.products?.length > 0 ? (
        <div className="space-y-8">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableCaption>Products currently in your cart.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">-</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">+</TableHead>
                  <TableHead className="text-center">Remove</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.products.map((product, ind) => (
                  <Cart product={product} ind={ind + 1} key={ind} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        /* EMPTY CART */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-xl font-semibold">Your cart is empty</p>

          <p className="text-gray-500">
            Looks like you haven&apos;t added any products yet.
          </p>

          <Button size="lg">Browse Products</Button>
        </div>
      )}
    </section>
  );
};

export default ManageCart;
