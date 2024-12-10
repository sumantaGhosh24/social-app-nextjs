"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import NotificationModel from "@/models/notificationModel";
import UserModel from "@/models/userModel";

import getServerUser from "./getServerUser";

interface FetchNotificationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function getNotifications({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchNotificationParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const notificationsQuery = await NotificationModel.find({user: user._id})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "from",
        model: UserModel,
        select: "_id name email profileImage",
      });
    const notificationsCount = await NotificationModel.countDocuments({
      user: user._id,
    });
    return {
      data: JSON.parse(JSON.stringify(notificationsQuery)),
      totalPages: Math.ceil(notificationsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get notifications data: ${error.message}`);
  }
}

export async function updateNotification(id: string, path: string) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    await NotificationModel.findOneAndUpdate(
      {_id: id, user: user?._id},
      {isRead: true}
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update notification: ${error.message}`);
  }
}

export async function updateAllNotifications(path: string) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    await NotificationModel.updateMany({user: user?._id}, {isRead: true});

    await UserModel.findByIdAndUpdate(user?._id, {hasNotification: false});

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update all notifications: ${error.message}`);
  }
}
