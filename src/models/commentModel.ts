import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";
import {IPost} from "./postModel";

export interface IComment extends Document {
  _id: string;
  postedBy: IUser;
  postId: IPost;
  message: string;
  parentComment: any;
  replies: any[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema(
  {
    postedBy: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    postId: {type: Schema.Types.ObjectId, required: true, ref: "Post"},
    message: {type: String, required: true},
    parentComment: {type: Schema.Types.ObjectId, ref: "Comment", default: null},
    replies: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  },
  {timestamps: true}
);

CommentSchema.pre("find", function (next) {
  this.populate({path: "replies", populate: {path: "postedBy"}});
  next();
});

const CommentModel =
  models?.Comment || model<IComment>("Comment", CommentSchema);

export default CommentModel;
