import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";
import {IProduct} from "./productModel";

export interface IOrder extends Document {
  _id: string;
  user: IUser;
  orderItems: {
    product: IProduct;
    quantity: number;
  }[];
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    zip: string;
    country: string;
    state: string;
  };
  orderStatus: string;
  price: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paidAt: Date;
  deliverAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paidAt: {
      type: Date,
    },
    deliverAt: {
      type: Date,
    },
  },
  {timestamps: true}
);

const OrderModel = models?.Order || model<IOrder>("Order", OrderSchema);

export default OrderModel;
