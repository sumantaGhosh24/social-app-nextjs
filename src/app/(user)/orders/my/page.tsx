import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getUserOrders} from "@/actions/orderActions";
import ManageOrders from "@/components/manage-orders";

export const metadata = {
  title: "My Orders",
};

interface MyOrdersPageProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function MyOrdersPage({searchParams}: MyOrdersPageProps) {
  const {page} = await searchParams;

  const user = await getServerUser();

  if (!user) redirect("/");

  const orders = await getUserOrders({
    pageNumber: Number(page) || 1,
    pageSize: 10,
    user: user._id,
  });

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage My Orders</h2>
        <p className="text-gray-600">Admin manage my orders.</p>
      </div>
      <ManageOrders
        data={orders?.data}
        emptyTitle="No my orders found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={orders?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
