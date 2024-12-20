"use server";

import {revalidatePath} from "next/cache";
import {SortOrder} from "mongoose";

import connectDB from "@/lib/db";
import UserModel from "@/models/userModel";
import AudioModel from "@/models/audioModel";
import NotificationModel from "@/models/notificationModel";
import {uploadToCloudinary} from "@/lib/cloudinary";
import {dynamicBlurDataUrl} from "@/lib/utils";

import getServerUser from "./getServerUser";

interface GetAudiosParams {
  id?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

interface CreateAudioParams {
  title: string;
  formData: any;
  path: string;
}

interface UpdateAudioPublicParams {
  id: string;
  isPublic: boolean;
  path: string;
}

interface LikeAudioParams {
  audioId: string;
  audioUserId: string;
  path: string;
}

interface DislikeAudioParams {
  audioId: string;
  path: string;
}

interface SaveAudioParams {
  audioId: string;
  path: string;
}

const populateAudio = (query: any) => {
  return query.populate({
    path: "user",
    model: UserModel,
    select: "_id name email username profileImage",
  });
};

export async function getAudio(id: string) {
  try {
    connectDB();

    const audio = await AudioModel.findById(id).populate({
      path: "user",
      model: UserModel,
      select:
        "_id name email username profileImage dob createdAt followers followings",
    });

    return JSON.parse(JSON.stringify(audio));
  } catch (error: any) {
    throw new Error(`Failed to get audio data: ${error.message}`);
  }
}

export async function getAudios({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetAudiosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const audiosQuery = AudioModel.find({
      user: [...user.followings, user._id],
      public: true,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const audios = await populateAudio(audiosQuery);
    const audiosCount = await AudioModel.countDocuments({
      user: [...user.followings, user._id],
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(audios)),
      totalPages: Math.ceil(audiosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get audios data: ${error.message}`);
  }
}

export async function getAudioLikes(id: string) {
  try {
    connectDB();

    const userData = await AudioModel.findById(id).select("likes").populate({
      path: "likes",
      model: UserModel,
      select: "-password",
    });
    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get audio likes: ${error.message}`);
  }
}

export async function getUserAudios({
  id,
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetAudiosParams) {
  try {
    connectDB();

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const audiosQuery = AudioModel.find({user: id, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const audios = await populateAudio(audiosQuery);
    const audiosCount = await AudioModel.countDocuments({
      user: id,
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(audios)),
      totalPages: Math.ceil(audiosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user audios data: ${error.message}`);
  }
}

export async function getPrivateAudio({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetAudiosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const audiosQuery = AudioModel.find({
      user: user._id,
      public: false,
    })
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const audios = await populateAudio(audiosQuery);
    const audiosCount = await AudioModel.countDocuments({
      user: user._id,
      public: false,
    });
    return {
      data: JSON.parse(JSON.stringify(audios)),
      totalPages: Math.ceil(audiosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user private audios: ${error.message}`);
  }
}

export async function getLikedAudios({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetAudiosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const audiosQuery = AudioModel.find({likes: user._id})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const audios = await populateAudio(audiosQuery);
    const audiosCount = await AudioModel.countDocuments({likes: user._id});
    return {
      data: JSON.parse(JSON.stringify(audios)),
      totalPages: Math.ceil(audiosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user liked audios: ${error.message}`);
  }
}

export async function getSavedAudios() {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const userData = await UserModel.findById(user._id)
      .select("audioSaved")
      .populate({
        path: "audioSaved",
        model: AudioModel,
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
    throw new Error(`Failed to get user saved audios: ${error.message}`);
  }
}

export async function getDiscoverAudios({
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: GetAudiosParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const newArr = [...user.followings.map((item) => String(item)), user._id];

    const skipAmount = (Number(pageNumber) - 1) * pageSize;
    const audiosQuery = AudioModel.find({user: {$nin: newArr}, public: true})
      .sort({createdAt: sortBy})
      .skip(skipAmount)
      .limit(pageSize);
    const audios = await populateAudio(audiosQuery);
    const audiosCount = await AudioModel.countDocuments({
      user: {$nin: newArr},
      public: true,
    });
    return {
      data: JSON.parse(JSON.stringify(audios)),
      totalPages: Math.ceil(audiosCount / pageSize),
    };
  } catch (error: any) {
    throw new Error(`Failed to get discover audios data: ${error.message}`);
  }
}

export async function createAudio({title, formData, path}: CreateAudioParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const files = formData.getAll("files");
    if (!files) throw new Error("Image is required.");

    const audios = formData.getAll("audios");
    if (!audios) throw new Error("Image is required.");

    const imageData = await uploadToCloudinary(files);
    const blurData = await dynamicBlurDataUrl(imageData[0].secure_url);

    const audioData = await uploadToCloudinary(audios);

    const newAudio = new AudioModel({
      user: user._id,
      title,
      audio: {
        url: audioData[0].secure_url,
        public_id: audioData[0].public_id,
      },
      thumbnail: {
        url: imageData[0].secure_url,
        public_id: imageData[0].public_id,
        blurHash: blurData,
      },
    });

    await newAudio.save();

    user?.followers &&
      user?.followers.map(async (us: string) => {
        await NotificationModel.create({
          from: user._id,
          user: us,
          message: `${user?.name} create a audio!`,
          url: `${process.env.NEXTAUTH_URL}/audio/${newAudio._id}`,
        });
      });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create audio: ${error.message}`);
  }
}

export async function updateAudioPublic({
  id,
  isPublic,
  path,
}: UpdateAudioPublicParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const audio = await AudioModel.findOneAndUpdate(
      {_id: id, user: user._id},
      {public: isPublic},
      {new: true}
    );

    if (!audio) throw new Error("Audio not found.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update audio public: ${error.message}`);
  }
}

export async function likeAudio({audioId, audioUserId, path}: LikeAudioParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadyLiked = await AudioModel.find({
      _id: audioId,
      likes: user._id,
    });
    if (checkAlreadyLiked.length > 0) return;

    const like = await AudioModel.findOneAndUpdate(
      {_id: audioId},
      {$push: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This audio does not exists.");

    if (audioUserId != user._id) {
      await NotificationModel.create({
        from: user._id,
        user: audioUserId,
        message: `${user.name} liked your audio!`,
        url: `${process.env.NEXTAUTH_URL}/audio/${like._id}`,
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to like audio: ${error.message}`);
  }
}

export async function dislikeAudio({audioId, path}: DislikeAudioParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const like = await AudioModel.findOneAndUpdate(
      {_id: audioId},
      {$pull: {likes: user._id}},
      {new: true}
    );
    if (!like) throw new Error("This audio does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to dislike audio: ${error.message}`);
  }
}

export async function saveAudio({audioId, path}: SaveAudioParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const checkAlreadySaved = await UserModel.find({
      _id: user._id,
      audioSaved: audioId,
    });
    if (checkAlreadySaved.length > 0) return;

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$push: {audioSaved: audioId}},
      {new: true}
    );
    if (!save) throw new Error("This audio does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to save audio: ${error.message}`);
  }
}

export async function unSaveAudio({audioId, path}: DislikeAudioParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized!");

    const save = await UserModel.findOneAndUpdate(
      {_id: user._id},
      {$pull: {audioSaved: audioId}},
      {new: true}
    );
    if (!save) throw new Error("This audio does not exists.");

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to unsave audio: ${error.message}`);
  }
}
