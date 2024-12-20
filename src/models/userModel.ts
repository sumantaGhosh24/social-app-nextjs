import {Schema, model, models} from "mongoose";

import {IPost} from "./postModel";
import {IAudio} from "./audioModel";
import {IVideo} from "./videoModel";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  mobileNumber: string;
  profileImage: {
    url: string;
    public_id: string;
    blurHash: string;
  };
  coverImage: {
    url: string;
    public_id: string;
    blurHash: string;
  };
  followers: any[];
  followings: any[];
  saved: IPost[];
  audioSaved: IAudio[];
  videoSaved: IVideo[];
  dob: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  socialLinks: {
    title: string;
    link: string;
  }[];
  hasNotification: boolean;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      url: String,
      public_id: String,
      blurHash: String,
    },
    coverImage: {
      url: String,
      public_id: String,
      blurHash: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    audioSaved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    videoSaved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zip: {
      type: String,
    },
    addressline: {
      type: String,
    },
    socialLinks: [
      {
        title: String,
        link: String,
      },
    ],
    hasNotification: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {timestamps: true}
);

UserSchema.index({name: "text", username: "text", email: "text"});

const UserModel = models?.User || model<IUser>("User", UserSchema);

export default UserModel;
