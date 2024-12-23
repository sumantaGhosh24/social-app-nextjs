import {Schema, model, models} from "mongoose";

export interface ICategory extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {timestamps: true}
);

const CategoryModel =
  models?.Category || model<ICategory>("Category", CategorySchema);

export default CategoryModel;
