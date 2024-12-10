import {getNotifications} from "@/actions/notificationActions";

import NotificationFeed from "./_components/notification-feed";

export const metadata = {
  title: "Notifications",
};

interface NotificationsProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

const Notifications = async ({searchParams}: NotificationsProps) => {
  const {page} = await searchParams;

  const notifications = await getNotifications({
    pageNumber: Number(page) || 1,
    pageSize: 5,
  });

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <h1 className="mb-5 text-3xl font-bold">My Notifications</h1>
      <NotificationFeed
        data={notifications?.data}
        emptyTitle="No notification found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={notifications?.totalPages}
      />
    </div>
  );
};

export default Notifications;
