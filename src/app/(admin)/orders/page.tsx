import getServerUser from "@/actions/getServerUser";
import {getAllOrders} from "@/actions/orderActions";
import ManageOrders from "@/components/manage-orders";

export const metadata = {
  title: "Manage Orders",
};

interface ManageOrdersPageProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function ManageOrdersPage({
  searchParams,
}: ManageOrdersPageProps) {
  const {page} = await searchParams;

  const orders = await getAllOrders({
    pageNumber: Number(page) || 1,
    pageSize: 10,
  });

  const user = await getServerUser();

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <div className="mb-8 text-left">
        <h2 className="mb-4 text-3xl font-bold">Manage Orders</h2>
        <p className="text-gray-600">Admin manage all orders.</p>
      </div>
      <ManageOrders
        data={orders?.data}
        emptyTitle="No orders found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={orders?.totalPages}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
