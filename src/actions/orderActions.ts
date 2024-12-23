"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import OrderModel from "@/models/orderModel";
import ProductModel from "@/models/productModel";
import UserModel from "@/models/userModel";

interface FetchOrderParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface FetchUserOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  user: string;
}

interface UpdateOrderParams {
  id: string;
  orderStatus: string;
  deliverAt: any;
  path: string;
}

const populateOrder = (query: any) => {
  return query
    .populate({
      path: "user",
      model: UserModel,
      select: "_id name email username profileImage",
    })
    .populate({
      path: "orderItems.product",
      model: ProductModel,
      select: "_id title price image",
    });
};

export async function getAllOrders({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchOrderParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const ordersQuery = OrderModel.find({})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const orders = await populateOrder(ordersQuery);
    const ordersCount = await OrderModel.countDocuments({});
    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get all orders data: ${error.message}`);
  }
}

export async function getOrder(id: string) {
  try {
    connectDB();

    const order = await OrderModel.findById(id)
      .populate("user", "_id name email username profileImage")
      .populate("orderItems.product", "_id title price image");

    return JSON.parse(JSON.stringify(order));
  } catch (error: any) {
    throw new Error(`Failed to get order data: ${error.message}`);
  }
}

export async function getUserOrders({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  user,
}: FetchUserOrdersParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const ordersQuery = OrderModel.find({user})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const orders = await populateOrder(ordersQuery);
    const ordersCount = await OrderModel.countDocuments({user});
    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user orders data: ${error.message}`);
  }
}

export async function updateOrder({
  id,
  orderStatus,
  deliverAt,
  path,
}: UpdateOrderParams) {
  try {
    connectDB();

    const order = await OrderModel.findById(id);
    if (!order) throw new Error("Order not found.");

    await OrderModel.findByIdAndUpdate(id, {
      orderStatus,
      deliverAt,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
}
