import {NextResponse} from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const {price} = await req.json();

  const options = {
    amount: price,
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  return NextResponse.json({msg: "success", order});
}
