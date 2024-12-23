import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getUserOrders} from "@/actions/orderActions";
import ManageOrders from "@/components/manage-orders";

export const metadata = {
  title: "User Orders",
};

interface UserOrdersPageProps {
  searchParams: {[key: string]: string | string[] | undefined};
  params: {id: string};
}

export default async function UserOrdersPage({
  searchParams,
  params,
}: UserOrdersPageProps) {
  const {page} = await searchParams;
  const {id} = await params;

  if (!id) redirect("/orders");

  const orders = await getUserOrders({
    pageNumber: Number(page) || 1,
    pageSize: 10,
    user: id,
  });

  const user = await getServerUser();

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage User Orders</h2>
        <p className="text-gray-600">Admin manage user orders.</p>
      </div>
      <ManageOrders
        data={orders?.data}
        emptyTitle="No user orders found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={orders?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
