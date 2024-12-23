import {Schema, model, models} from "mongoose";

import {IProduct} from "./productModel";
import {IUser} from "./userModel";

export interface IReview extends Document {
  _id: string;
  user: IUser;
  product: IProduct;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {timestamps: true}
);

const ReviewModel = models?.Review || model<IReview>("Review", ReviewSchema);

export default ReviewModel;
