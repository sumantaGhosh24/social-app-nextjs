"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import ReviewModel from "@/models/reviewModel";
import ProductModel from "@/models/productModel";
import UserModel from "@/models/userModel";

interface ReviewParams {
  id?: string;
  user: string;
  product: string;
  comment: string;
  rating: string;
  path: string;
}

interface FetchReviewParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface FetchProductReviewsParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  product: string;
}

interface FetchUserReviewsParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  user: string;
}

const populateReview = (query: any) => {
  return query
    .populate({
      path: "product",
      model: ProductModel,
      select: "_id title image price",
    })
    .populate({
      path: "user",
      model: UserModel,
      select: "_id name email profileImage",
    });
};

export async function getAllReviews({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchReviewParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const reviewsQuery = ReviewModel.find({})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const reviews = await populateReview(reviewsQuery);
    const reviewsCount = await ReviewModel.countDocuments({});
    return {
      data: JSON.parse(JSON.stringify(reviews)),
      totalPages: Math.ceil(reviewsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get all reviews data: ${error.message}`);
  }
}

export async function getProductReviews({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  product,
}: FetchProductReviewsParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const reviewsQuery = ReviewModel.find({product})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const reviews = await populateReview(reviewsQuery);
    const reviewsCount = await ReviewModel.countDocuments({product});
    return {
      data: JSON.parse(JSON.stringify(reviews)),
      totalPages: Math.ceil(reviewsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get product reviews data: ${error.message}`);
  }
}

export async function getUserReviews({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
  user,
}: FetchUserReviewsParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const reviewsQuery = ReviewModel.find({user})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const reviews = await populateReview(reviewsQuery);
    const reviewsCount = await ReviewModel.countDocuments({user});
    return {
      data: JSON.parse(JSON.stringify(reviews)),
      totalPages: Math.ceil(reviewsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user reviews data: ${error.message}`);
  }
}

export async function createReview({
  user,
  product,
  comment,
  rating,
  path,
}: ReviewParams) {
  try {
    connectDB();

    const newReview = new ReviewModel({
      user,
      product,
      comment: comment.toLowerCase(),
      rating,
    });

    await newReview.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create review: ${error.message}`);
  }
}
