import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";
import {IProduct} from "./productModel";

export interface ICart extends Document {
  _id: string;
  user: IUser;
  products: {
    product: IProduct;
    quantity: number;
    price: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        product: {type: Schema.Types.ObjectId, ref: "Product"},
        quantity: {type: Number},
        price: {type: Number},
        taxPrice: {type: Number},
        shippingPrice: {type: Number},
        totalPrice: {type: Number},
      },
    ],
  },
  {timestamps: true}
);

const CartModel = models?.Cart || model<ICart>("Cart", CartSchema);

export default CartModel;
