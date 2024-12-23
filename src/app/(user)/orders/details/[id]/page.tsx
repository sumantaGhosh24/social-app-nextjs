import {redirect} from "next/navigation";

import {getOrder} from "@/actions/orderActions";
import getServerUser from "@/actions/getServerUser";

import OrderDetails from "./_components/order-details";
import UpdateOrderForm from "./_components/update-order-form";

export const metadata = {
  title: "Order",
};

interface OrderDetailsPageProps {
  params: {id: string};
}

export default async function OrderPage({params}: OrderDetailsPageProps) {
  const {id} = await params;

  const order = await getOrder(id);

  if (!order) redirect("/");

  const user = await getServerUser();

  if (!user) redirect("/");

  return (
    <>
      <OrderDetails order={order} />
      {user.role === "admin" && <UpdateOrderForm order={order} />}
    </>
  );
}
