import {getCart} from "@/actions/cartActions";

import Checkout from "./_components/checkout";
import ManageCart from "./_components/manage-cart";

export const metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="container mx-auto my-20 flex items-start justify-between flex-wrap flex-col md:flex-row gap-5">
      <ManageCart cart={cart} />
      {cart && cart.products && cart.products.length > 0 && (
        <Checkout cart={cart} />
      )}
    </div>
  );
}
