import {NextResponse} from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/db";
import OrderModel from "@/models/orderModel";
import CartModel from "@/models/cartModel";
import getServerUser from "@/actions/getServerUser";

export async function POST(req: Request) {
  const {
    id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderItems,
    shippingAddress,
    price,
    taxPrice,
    shippingPrice,
    totalPrice,
    cartId,
  } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    connectDB();

    const user = await getServerUser();

    var date_time = new Date();

    await OrderModel.create({
      user: user?._id,
      orderItems,
      paymentResult: {
        id: id,
        status: "success",
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
      },
      shippingAddress,
      orderStatus: "pending",
      price,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: date_time,
    });

    await CartModel.findByIdAndDelete(cartId);
  } else {
    return NextResponse.json({message: "fail"}, {status: 400});
  }

  return NextResponse.json({message: "success"}, {status: 200});
}
