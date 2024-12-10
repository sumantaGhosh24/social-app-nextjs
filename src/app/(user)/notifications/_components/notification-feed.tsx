"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {formatDistanceToNowStrict} from "date-fns";
import {Eye} from "lucide-react";

import {
  updateAllNotifications,
  updateNotification,
} from "@/actions/notificationActions";
import {INotification} from "@/models/notificationModel";
import {useToast} from "@/hooks/use-toast";
import {usePrimaryColor} from "@/components/primary-provider";
import Pagination from "@/components/pagination";
import {Button} from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

interface NotificationFeedProps {
  data: INotification[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
}

const NotificationFeed = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
}: NotificationFeedProps) => {
  const [loading, setLoading] = useState(false);

  const path = usePathname();

  const {primaryColor} = usePrimaryColor();
  const {toast} = useToast();

  const markAsRead = async (id: string) => {
    setLoading(true);

    try {
      await updateNotification(id, path);
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

  const markAllRead = async () => {
    setLoading(true);

    try {
      await updateAllNotifications(path);
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
    <>
      <Button
        variant="default"
        onClick={() => markAllRead()}
        disabled={loading}
        className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 mb-4 md:mr-4`}
      >
        <Eye size={24} className="mr-2" />
        Mark All As Read
      </Button>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>My notifications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Read</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={
                        notification.from.profileImage.url ||
                        "https://placehold.co/600x400.png"
                      }
                      alt={
                        notification.from.profileImage.public_id || "placehold"
                      }
                      height={100}
                      width={100}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="capitalize font-bold">
                        {notification.from.name}
                      </h3>
                      <h4>{notification.from.email}</h4>
                    </div>
                  </TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    {notification.isRead ? (
                      <Badge variant="secondary">Read</Badge>
                    ) : (
                      <Badge className={`bg-${primaryColor}-700 animate-pulse`}>
                        New
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(notification.createdAt)}
                  </TableCell>
                  <TableCell>
                    {!notification.isRead && (
                      <Button
                        variant="default"
                        onClick={() => markAsRead(notification._id)}
                        disabled={loading}
                        className={`max-w-fit bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300 mb-4 md:mr-4`}
                      >
                        <Eye size={24} className="mr-2" />
                        Mark As Read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
        </div>
      ) : (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
          <h3 className="text-xl font-bold">{emptyTitle}</h3>
          <p>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default NotificationFeed;
