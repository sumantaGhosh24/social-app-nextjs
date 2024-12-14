"use server";

import {revalidatePath} from "next/cache";
import bcrypt from "bcryptjs";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import {dynamicBlurDataUrl} from "@/lib/utils";
import {uploadToCloudinary} from "@/lib/cloudinary";
import UserModel from "@/models/userModel";
import PostModel from "@/models/postModel";
import NotificationModel from "@/models/notificationModel";

import getServerUser from "./getServerUser";

interface RegisterUserParams {
  name: string;
  email: string;
  username: string;
  password: string;
  mobileNumber: string;
  gender: string;
  dob: any;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
}

interface FetchUserParams {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface UpdateUserParams {
  id: string;
  name: string;
  username: string;
  dob: any;
  gender: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  path: string;
}

interface UpdateProfileImageParams {
  id: string;
  formData: any;
  path: string;
  name: string;
}

interface UpdateCoverImageParams {
  id: string;
  formData: any;
  path: string;
  name: string;
}

interface ResetPasswordParams {
  id: string;
  oldPassword: string;
  password: string;
  cf_password: string;
  path: string;
}

export async function registerUser({
  name,
  email,
  username,
  password,
  mobileNumber,
  gender,
  dob,
  city,
  state,
  country,
  zip,
  addressline,
}: RegisterUserParams) {
  try {
    connectDB();

    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !mobileNumber ||
      !gender ||
      !dob ||
      !city ||
      !state ||
      !country ||
      !zip ||
      !addressline
    ) {
      throw new Error("Please fill the fields.");
    }

    const userEmail = await UserModel.findOne({email});
    if (userEmail)
      throw new Error("This email already registered, try another one.");

    const userMobileNumber = await UserModel.findOne({mobileNumber});
    if (userMobileNumber)
      throw new Error("This mobileNumber already registered, try another one.");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      mobileNumber,
      name,
      username,
      dob,
      gender,
      city,
      state,
      country,
      zip,
      addressline,
    });
    await newUser.save();
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

export async function getUser(id: string) {
  try {
    connectDB();

    const userData = await UserModel.findById(id).select("-password");
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}

export async function getFollowers(id: string) {
  try {
    connectDB();

    const userData = await UserModel.findById(id).select("followers").populate({
      path: "followers",
      model: UserModel,
      select: "-password",
    });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user followers: ${error.message}`);
  }
}

export async function getFollowings(id: string) {
  try {
    connectDB();

    const userData = await UserModel.findById(id)
      .select("followings")
      .populate({
        path: "followings",
        model: UserModel,
        select: "-password",
      });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user followings: ${error.message}`);
  }
}

export async function updateUser({
  id,
  name,
  username,
  dob,
  gender,
  city,
  state,
  country,
  zip,
  addressline,
  path,
}: UpdateUserParams) {
  try {
    connectDB();

    await UserModel.findByIdAndUpdate(id, {
      name: name.toLowerCase(),
      username: username.toLowerCase(),
      dob,
      gender,
      city: city.toLowerCase(),
      state: state.toLowerCase(),
      country: country.toLowerCase(),
      zip,
      addressline: addressline.toLowerCase(),
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

export async function getUsers({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
}: FetchUserParams) {
  try {
    connectDB();

    const nameCondition = searchString
      ? {name: {$regex: searchString, $options: "i"}}
      : {};
    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const usersQuery = await UserModel.find(nameCondition)
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const usersCount = await UserModel.countDocuments(nameCondition);
    return {
      data: JSON.parse(JSON.stringify(usersQuery)),
      totalPages: Math.ceil(usersCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get users data: ${error.message}`);
  }
}

export async function searchUsers({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  searchString = "",
}: FetchUserParams) {
  try {
    connectDB();

    const currentUser = await getServerUser();
    if (!currentUser) throw new Error("Unauthorized!");

    const nameCondition = searchString
      ? {name: {$regex: searchString, $options: "i"}}
      : {};

    const excludeCurrentUserCondition = currentUser
      ? {_id: {$ne: currentUser?._id}}
      : {};

    const skipAmount = (Number(pageNumber) - 1) * pageSize;

    const usersQuery = await UserModel.find({
      ...nameCondition,
      ...excludeCurrentUserCondition,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);

    const usersCount = await UserModel.countDocuments({
      ...nameCondition,
      ...excludeCurrentUserCondition,
    });

    return {
      data: JSON.parse(JSON.stringify(usersQuery)),
      totalPages: Math.ceil(usersCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to search users: ${error.message}`);
  }
}

export async function updateProfileImage({
  id,
  formData,
  name,
  path,
}: UpdateProfileImageParams) {
  try {
    connectDB();

    const files = formData.getAll("files");
    if (!files) throw new Error("Image is required.");

    const [res] = await uploadToCloudinary(files);

    const blurData = await dynamicBlurDataUrl(res.secure_url);

    const newPost = new PostModel({
      user: id,
      image: [
        {
          url: res?.secure_url,
          public_id: res?.public_id,
          blurHash: blurData,
        },
      ],
    });

    await newPost.save();

    const user = await UserModel.findByIdAndUpdate(id, {
      profileImage: {
        url: res?.secure_url,
        public_id: res?.public_id,
        blurHash: blurData,
      },
    });

    user.followers.map(async (us: string) => {
      await NotificationModel.create({
        from: id,
        user: us,
        message: `${name} post a image!`,
        url: `${process.env.NEXTAUTH_URL}/post/${newPost._id}`,
      });
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update user profile image: ${error.message}`);
  }
}

export async function updateCoverImage({
  id,
  formData,
  name,
  path,
}: UpdateCoverImageParams) {
  try {
    connectDB();

    const files = formData.getAll("files");
    if (!files) throw new Error("Image is required.");

    const [res] = await uploadToCloudinary(files);

    const blurData = await dynamicBlurDataUrl(res.secure_url);

    const newPost = new PostModel({
      user: id,
      image: [
        {
          url: res?.secure_url,
          public_id: res?.public_id,
          blurHash: blurData,
        },
      ],
    });

    await newPost.save();

    const user = await UserModel.findByIdAndUpdate(id, {
      coverImage: {
        url: res?.secure_url,
        public_id: res?.public_id,
        blurHash: blurData,
      },
    });

    user.followers.map(async (us: string) => {
      await NotificationModel.create({
        from: id,
        user: us,
        message: `${name} post a image!`,
        url: `${process.env.NEXTAUTH_URL}/post/${newPost._id}`,
      });
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to update user cover image: ${error.message}`);
  }
}

export async function resetPassword({
  id,
  oldPassword,
  password,
  cf_password,
  path,
}: ResetPasswordParams) {
  try {
    connectDB();

    if (!oldPassword || !password || !cf_password) {
      throw new Error("Please fill the fields.");
    }

    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found.");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password not match, try again.");

    if (password !== cf_password)
      throw new Error("Password and confirm password not match.");

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

export async function follow(userId: string, path: string) {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user id.");
    }

    const currentUser = await getServerUser();
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    const check = await UserModel.find({
      _id: userId,
      followers: currentUser?._id,
    });
    if (check.length > 0) return;

    await UserModel.findOneAndUpdate(
      {_id: userId},
      {$push: {followers: currentUser?._id}},
      {new: true}
    );

    const user = await UserModel.findOneAndUpdate(
      {_id: currentUser?._id},
      {$push: {followings: userId}},
      {new: true}
    );

    await NotificationModel.create({
      from: currentUser?._id,
      user: userId,
      message: `${user.username} followed you!`,
      url: `${process.env.NEXTAUTH_URL}/profile/${user._id}`,
    });

    await UserModel.findOneAndUpdate({_id: userId}, {hasNotification: true});

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

export async function unfollow(userId: string, path: string) {
  try {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user id.");
    }

    const currentUser = await getServerUser();
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    await UserModel.findOneAndUpdate(
      {_id: userId},
      {$pull: {followers: currentUser?._id}},
      {new: true}
    );

    await UserModel.findOneAndUpdate(
      {_id: currentUser?._id},
      {$pull: {followings: userId}},
      {new: true}
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}

export async function getUserSuggestions() {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const newArr = [...user.followings];
    const limit = 10;

    const users = await UserModel.aggregate([
      {$match: {_id: {$nin: newArr}}},
      {$sample: {size: Number(limit)}},
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followings",
          foreignField: "_id",
          as: "followings",
        },
      },
    ]);

    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    throw new Error(`Failed to get user suggestion data: ${error.message}`);
  }
}
