import {Schema, model, models} from "mongoose";

import {IUser} from "./userModel";

export interface IAudio extends Document {
  _id: string;
  user: IUser;
  title: string;
  audio: {
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

const AudioSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, trim: true},
    audio: {url: String, public_id: String},
    thumbnail: {url: String, public_id: String, blurHash: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    public: {type: Boolean, default: true},
  },
  {timestamps: true}
);

const AudioModel = models?.Audio || model<IAudio>("Audio", AudioSchema);

export default AudioModel;
