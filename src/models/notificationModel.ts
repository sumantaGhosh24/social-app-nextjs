import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";

export interface INotification extends Document {
  _id: string;
  from: IUser;
  user: IUser;
  message: string;
  isRead: boolean;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
  },
  {timestamps: true}
);

const NotificationModel =
  models?.Notification ||
  model<INotification>("Notification", NotificationSchema);

export default NotificationModel;
