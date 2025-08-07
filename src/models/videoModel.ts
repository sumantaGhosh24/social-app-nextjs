import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";

export interface IVideo extends Document {
  _id: string;
  user: IUser;
  title: string;
  video: {
    url: string;
    public_id: string;
  };
  thumbnail: {
    url: string;
    public_id: string;
    blurHash: string;
  };
  likes: IUser[];
  public: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, trim: true},
    video: {url: String, public_id: String},
    thumbnail: {url: String, public_id: String, blurHash: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    public: {type: Boolean, default: true},
  },
  {timestamps: true}
);

const VideoModel = models?.Video || model<IVideo>("Video", VideoSchema);

export default VideoModel;
