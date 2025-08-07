import {Schema, model, models} from "mongoose";

import {ICategory} from "./categoryModel";
import {IUser} from "./userModel";

export interface IProduct extends Document {
  _id: string;
  owner: IUser;
  title: string;
  description: string;
  content: string;
  image: {
    url: string;
    public_id: string;
    blurHash: string;
  }[];
  category: ICategory;
  price: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    owner: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, required: true},
    description: {type: String, required: true, trim: true},
    content: {type: String, required: true, trim: true},
    image: [{url: String, public_id: String, blurHash: String}],
    category: {type: Schema.Types.ObjectId, required: true, ref: "Category"},
    price: {type: String, required: true},
  },
  {timestamps: true}
);

ProductSchema.index({title: "text", category: "text"});

const ProductModel =
  models?.Product || model<IProduct>("Product", ProductSchema);

export default ProductModel;
