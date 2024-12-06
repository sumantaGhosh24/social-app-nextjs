"use server";

import {revalidatePath} from "next/cache";
import bcrypt from "bcryptjs";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import {destroyFromCloudinary, uploadToCloudinary} from "@/lib/cloudinary";
import UserModel from "@/models/userModel";

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
  formData?: any;
  dob: any;
  gender: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  public_id?: string;
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

export async function getUser() {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const userData = await UserModel.findById(user?._id).select("-password");
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user data: ${error.message}`);
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

export async function updateUser({
  id,
  name,
  username,
  formData,
  dob,
  gender,
  city,
  state,
  country,
  zip,
  addressline,
  public_id,
  path,
}: UpdateUserParams) {
  try {
    connectDB();

    if (!formData) {
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
    } else {
      const files = formData.getAll("files");

      const [res] = await uploadToCloudinary(files);

      await Promise.all([
        UserModel.findByIdAndUpdate(id, {
          name: name.toLowerCase(),
          username: username.toLowerCase(),
          dob,
          gender,
          city: city.toLowerCase(),
          state: state.toLowerCase(),
          country: country.toLowerCase(),
          zip,
          addressline: addressline.toLowerCase(),
          image: {
            url: res?.secure_url,
            public_id: res?.public_id,
          },
        }),
        destroyFromCloudinary(public_id!),
      ]);
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}
