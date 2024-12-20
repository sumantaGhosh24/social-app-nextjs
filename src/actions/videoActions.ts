"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import UserModel from "@/models/userModel";
import VideoModel from "@/models/videoModel";
import NotificationModel from "@/models/notificationModel";
import {uploadToCloudinary} from "@/lib/cloudinary";
import {dynamicBlurDataUrl} from "@/lib/utils";

import getServerUser from "./getServerUser";

interface GetVideosParams {
  id?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface CreateVideoParams {
  title: string;
  formData: any;
  path: string;
}

interface UpdateVideoPublicParams {
  id: string;
  isPublic: boolean;
  path: string;
}

interface LikeVideoParams {
  videoId: string;
  videoUserId: string;
  path: string;
}

interface DislikeVideoParams {
  videoId: string;
  path: string;
}

interface SaveVideoParams {
  videoId: string;
  path: string;
}

const populateVideo = (query: any) => {
  return query.populate({
    path: "user",
    model: UserModel,
    select: "_id name email username profileImage",
  });
};

export async function getVideo(id: string) {
  try {
    connectDB();

    const video = await VideoModel.findById(id).populate({
      path: "user",
      model: UserModel,
      select:
        "_id name email username profileImage dob createdAt followers followings",
    });

    return JSON.parse(JSON.stringify(video));
  } catch (error: any) {
    throw new Error(`Failed to get video data: ${error.message}`);
  }
}

export async function getVideos({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetVideosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const videosQuery = VideoModel.find({
      user: [...user.followings, user._id],
      public: true,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const videos = await populateVideo(videosQuery);
    const videosCount = await VideoModel.countDocuments({
      user: [...user.followings, user._id],
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(videos)),
      totalPages: Math.ceil(videosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get videos data: ${error.message}`);
  }
}

export async function getVideoLikes(id: string) {
  try {
    connectDB();

    const userData = await VideoModel.findById(id).select("likes").populate({
      path: "likes",
      model: UserModel,
      select: "-password",
    });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get video likes: ${error.message}`);
  }
}

export async function getUserVideos({
  id,
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetVideosParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const videosQuery = VideoModel.find({user: id, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const videos = await populateVideo(videosQuery);
    const videosCount = await VideoModel.countDocuments({
      user: id,
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(videos)),
      totalPages: Math.ceil(videosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user videos data: ${error.message}`);
  }
}

export async function getPrivateVideo({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetVideosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const videosQuery = VideoModel.find({
      user: user._id,
      public: false,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const videos = await populateVideo(videosQuery);
    const videosCount = await VideoModel.countDocuments({
      user: user._id,
      public: false,
    });
    return {
      data: JSON.parse(JSON.stringify(videos)),
      totalPages: Math.ceil(videosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user private videos: ${error.message}`);
  }
}

export async function getLikedVideos({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetVideosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const videosQuery = VideoModel.find({likes: user._id})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const videos = await populateVideo(videosQuery);
    const videosCount = await VideoModel.countDocuments({likes: user._id});
    return {
      data: JSON.parse(JSON.stringify(videos)),
      totalPages: Math.ceil(videosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user liked videos: ${error.message}`);
  }
}

export async function getSavedVideos() {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const userData = await UserModel.findById(user._id)
      .select("videoSaved")
      .populate({
        path: "videoSaved",
        model: VideoModel,
        populate: [
          {
            path: "user",
            model: UserModel,
            select: "_id name email username profileImage",
          },
        ],
      });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user saved videos: ${error.message}`);
  }
}

export async function getDiscoverVideos({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetVideosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const newArr = [...user.followings.map((item) => String(item)), user._id];

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const videosQuery = VideoModel.find({user: {$nin: newArr}, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const videos = await populateVideo(videosQuery);
    const videosCount = await VideoModel.countDocuments({
      user: {$nin: newArr},
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(videos)),
      totalPages: Math.ceil(videosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get discover videos data: ${error.message}`);
  }
}

export async function createVideo({title, formData, path}: CreateVideoParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const files = formData.getAll("files");
    if (!files) throw new Error("Image is required.");

    const videos = formData.getAll("videos");
    if (!videos) throw new Error("Image is required.");

    const imageData = await uploadToCloudinary(files);
    const blurData = await dynamicBlurDataUrl(imageData[0].secure_url);

    const videoData = await uploadToCloudinary(videos);

    const newVideo = new VideoModel({
      user: user._id,
      title,
      video: {
        url: videoData[0].secure_url,
        public_id: videoData[0].public_id,
      },
      thumbnail: {
        url: imageData[0].secure_url,
        public_id: imageData[0].public_id,
        blurHash: blurData,
      },
    });

    await newVideo.save();

    user?.followers &&
      user?.followers.map(async (us: string) => {
        await NotificationModel.create({
          from: user._id,
          user: us,
          message: `${user?.name} create a video!`,
          url: `${process.env.NEXTAUTH_URL}/video/${newVideo._id}`,
        });
      });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create video: ${error.message}`);
  }
}

export async function updateVideoPublic({
  id,
  isPublic,
  path,
}: UpdateVideoPublicParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const video = await VideoModel.findOneAndUpdate(
      {_id: id, user: user._id},
      {public: isPublic},
      {new: true}
    );

    if (!video) throw new Error("Video not found.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update video public: ${error.message}`);
  }
}

export async function likeVideo({videoId, videoUserId, path}: LikeVideoParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadyLiked = await VideoModel.find({
      _id: videoId,
      likes: user._id,
    });
    if (checkAlreadyLiked.length > 0) return;

    const like = await VideoModel.findOneAndUpdate(
      {_id: videoId},
      {$push: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This video does not exists.");

    if (videoUserId != user._id) {
      await NotificationModel.create({
        from: user._id,
        user: videoUserId,
        message: `${user.name} liked your video!`,
        url: `${process.env.NEXTAUTH_URL}/video/${like._id}`,
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to like video: ${error.message}`);
  }
}

export async function dislikeVideo({videoId, path}: DislikeVideoParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const like = await VideoModel.findOneAndUpdate(
      {_id: videoId},
      {$pull: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This video does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to dislike video: ${error.message}`);
  }
}

export async function saveVideo({videoId, path}: SaveVideoParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadySaved = await UserModel.find({
      _id: user._id,
      videoSaved: videoId,
    });
    if (checkAlreadySaved.length > 0) return;

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$push: {videoSaved: videoId}},
      {new: true}
    );
    if (!save) throw new Error("This video does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to save video: ${error.message}`);
  }
}

export async function unSaveVideo({videoId, path}: DislikeVideoParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$pull: {videoSaved: videoId}},
      {new: true}
    );
    if (!save) throw new Error("This video does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to unsave video: ${error.message}`);
  }
}
