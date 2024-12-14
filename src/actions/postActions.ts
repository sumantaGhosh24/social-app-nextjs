"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import UserModel from "@/models/userModel";
import PostModel from "@/models/postModel";
import NotificationModel from "@/models/notificationModel";
import {uploadToCloudinary} from "@/lib/cloudinary";
import {dynamicBlurDataUrl} from "@/lib/utils";

import getServerUser from "./getServerUser";

interface GetPostsParams {
  id?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface CreatePostParams {
  title: string;
  formData: any;
  path: string;
}

interface UpdatePostPublicParams {
  id: string;
  isPublic: boolean;
  path: string;
}

interface LikePostParams {
  postId: string;
  postUserId: string;
  path: string;
}

interface DislikePostParams {
  postId: string;
  path: string;
}

interface SavePostParams {
  postId: string;
  path: string;
}

interface DislikePostParams {
  postId: string;
  path: string;
}

const populatePost = (query: any) => {
  return query.populate({
    path: "user",
    model: UserModel,
    select: "_id name email username profileImage",
  });
};

export async function getPost(id: string) {
  try {
    connectDB();

    const post = await PostModel.findById(id).populate({
      path: "user",
      model: UserModel,
      select:
        "_id name email username profileImage dob createdAt followers followings",
    });

    return JSON.parse(JSON.stringify(post));
  } catch (error: any) {
    throw new Error(`Failed to get post data: ${error.message}`);
  }
}

export async function getPosts({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetPostsParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const postsQuery = PostModel.find({
      user: [...user.followings, user._id],
      public: true,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const posts = await populatePost(postsQuery);
    const postsCount = await PostModel.countDocuments({
      user: [...user.followings, user._id],
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(postsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get posts data: ${error.message}`);
  }
}

export async function getPostLikes(id: string) {
  try {
    connectDB();

    const userData = await PostModel.findById(id).select("likes").populate({
      path: "likes",
      model: UserModel,
      select: "-password",
    });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get post likes: ${error.message}`);
  }
}

export async function getUserPosts({
  id,
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetPostsParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const postsQuery = PostModel.find({user: id, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const posts = await populatePost(postsQuery);
    const postsCount = await PostModel.countDocuments({
      user: id,
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(postsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user posts data: ${error.message}`);
  }
}

export async function getPrivatePost({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetPostsParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const postsQuery = PostModel.find({
      user: user._id,
      public: false,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const posts = await populatePost(postsQuery);
    const postsCount = await PostModel.countDocuments({
      user: user._id,
      public: false,
    });
    return {
      data: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(postsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user private posts: ${error.message}`);
  }
}

export async function getLikedPosts({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetPostsParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const postsQuery = PostModel.find({likes: user._id})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const posts = await populatePost(postsQuery);
    const postsCount = await PostModel.countDocuments({likes: user._id});
    return {
      data: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(postsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user liked posts: ${error.message}`);
  }
}

export async function getSavedPosts() {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const userData = await UserModel.findById(user._id)
      .select("saved")
      .populate({
        path: "saved",
        model: PostModel,
      });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user saved posts: ${error.message}`);
  }
}

export async function getDiscoverPosts({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetPostsParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const newArr = [...user.followings.map((item) => String(item)), user._id];

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const postsQuery = PostModel.find({user: {$nin: newArr}, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const posts = await populatePost(postsQuery);
    const postsCount = await PostModel.countDocuments({
      user: {$nin: newArr},
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(posts)),
      totalPages: Math.ceil(postsCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get discover posts data: ${error.message}`);
  }
}

export async function createPost({title, formData, path}: CreatePostParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const files = formData.getAll("files");

    const photos = await uploadToCloudinary(files);

    const blurDataPromise = photos.map((photo) =>
      dynamicBlurDataUrl(photo.secure_url)
    );

    const blurData = await Promise.all(blurDataPromise);

    const imageData = photos.map((photo, i) => ({
      url: photo.secure_url,
      public_id: photo.public_id,
      blurHash: blurData[i],
    }));

    const newPost = new PostModel({
      user: user._id,
      title,
      image: imageData,
    });

    await newPost.save();

    user?.followers &&
      user?.followers.map(async (us: string) => {
        await NotificationModel.create({
          from: user._id,
          user: us,
          message: `${user?.name} post a image!`,
          url: `${process.env.NEXTAUTH_URL}/post/${newPost._id}`,
        });
      });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

export async function updatePostPublic({
  id,
  isPublic,
  path,
}: UpdatePostPublicParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const post = await PostModel.findOneAndUpdate(
      {_id: id, user: user._id},
      {public: isPublic},
      {new: true}
    );

    if (!post) throw new Error("Post not found.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update post public: ${error.message}`);
  }
}

export async function likePost({postId, postUserId, path}: LikePostParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadyLiked = await PostModel.find({
      _id: postId,
      likes: user._id,
    });
    if (checkAlreadyLiked.length > 0) return;

    const like = await PostModel.findOneAndUpdate(
      {_id: postId},
      {$push: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This post does not exists.");

    if (postUserId != user._id) {
      await NotificationModel.create({
        from: user._id,
        user: postUserId,
        message: `${user.name} liked your post!`,
        url: `${process.env.NEXTAUTH_URL}/post/${like._id}`,
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to like post: ${error.message}`);
  }
}

export async function dislikePost({postId, path}: DislikePostParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const like = await PostModel.findOneAndUpdate(
      {_id: postId},
      {$pull: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This post does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to dislike post: ${error.message}`);
  }
}

export async function savePost({postId, path}: SavePostParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadySaved = await UserModel.find({
      _id: user._id,
      saved: postId,
    });
    if (checkAlreadySaved.length > 0) return;

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$push: {saved: postId}},
      {new: true}
    );
    if (!save) throw new Error("This post does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to save post: ${error.message}`);
  }
}

export async function unSavePost({postId, path}: DislikePostParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$pull: {saved: postId}},
      {new: true}
    );
    if (!save) throw new Error("This post does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to unsave post: ${error.message}`);
  }
}
