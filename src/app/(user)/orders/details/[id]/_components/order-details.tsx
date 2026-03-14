"use client";

import Image from "next/image";

import {IOrder} from "@/models/orderModel";
import DialogProvider from "@/components/dialog-provider";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {usePrimaryColor} from "@/components/primary-provider";

interface OrderDetailProps {
  order: IOrder;
}

const OrderDetails = ({order}: OrderDetailProps) => {
  const {primaryColor} = usePrimaryColor();

  return (
    <div className="container mx-auto my-10 space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
      <div>
        <h2 className="text-2xl font-bold mb-6">Order Items</h2>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableCaption>Products included in this order</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((product, ind) => (
                <TableRow key={ind}>
                  <TableCell className="font-medium">{ind + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <DialogProvider
                        trigger={
                          <Image
                            src={product?.product?.image[0].url}
                            alt={product?.product?.image[0].public_id}
                            height={60}
                            width={60}
                            className="rounded-lg cursor-pointer hover:scale-105 transition"
                            placeholder="blur"
                            blurDataURL={product?.product?.image[0].blurHash}
                          />
                        }
                        title="Product Image"
                      >
                        <Image
                          src={product?.product?.image[0].url}
                          alt={product?.product?.image[0].public_id}
                          height={300}
                          width={500}
                          className="rounded-lg w-full"
                          placeholder="blur"
                          blurDataURL={product?.product?.image[0].blurHash}
                        />
                        <p className="mt-4 text-lg font-semibold capitalize">
                          {product?.product?.title}
                        </p>
                      </DialogProvider>
                      <span className="font-medium capitalize">
                        {product?.product?.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>₹{product?.product?.price}</TableCell>
                  <TableCell>{product?.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 space-y-3">
          <h3 className="text-xl font-bold mb-3">Payment Details</h3>
          <p>
            <span className="font-semibold">Payment ID:</span>{" "}
            {order.paymentResult.id}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {order.paymentResult.status}
          </p>
          <p>
            <span className="font-semibold">Order ID:</span>{" "}
            {order.paymentResult.razorpay_order_id}
          </p>
          <p>
            <span className="font-semibold">Payment Ref:</span>{" "}
            {order.paymentResult.razorpay_payment_id}
          </p>
        </div>
        <div className="border rounded-lg p-6 space-y-3">
          <h3 className="text-xl font-bold mb-3">Shipping Address</h3>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p>
            {order.shippingAddress.country} - {order.shippingAddress.zip}
          </p>
        </div>
      </div>
      <div className="border rounded-lg p-6 space-y-3">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{order.taxPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{order.shippingPrice}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className={`text-${primaryColor}-500`}>
            ₹{order.totalPrice}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 border rounded-lg p-6 w-full">
        <Image
          src={order.user.profileImage.url}
          alt={order.user.profileImage.public_id}
          height={70}
          width={70}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-lg capitalize">{order.user.name}</p>
          <p className="text-gray-500">{order.user.email}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between gap-6 text-sm text-gray-500 border-t pt-6">
        <p>
          <span className="font-semibold">Order Status:</span>{" "}
          {order.orderStatus.toUpperCase()}
        </p>
        <p>Paid: {new Date(order.paidAt).toLocaleDateString()}</p>
        <p>
          Delivered:{" "}
          {order.deliverAt
            ? new Date(order.deliverAt).toLocaleDateString()
            : "Not Delivered Yet"}
        </p>
        <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
