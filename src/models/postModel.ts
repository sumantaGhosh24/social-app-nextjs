import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";

export interface IPost extends Document {
  _id: string;
  user: IUser;
  title: string;
  image: {
    url: string;
    public_id: string;
    blurHash: string;
  };
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
    },
    image: {
      url: String,
      public_id: String,
      blurHash: String,
    },
    public: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true}
);

const PostModel = models?.Post || model("Post", PostSchema);

export default PostModel;
