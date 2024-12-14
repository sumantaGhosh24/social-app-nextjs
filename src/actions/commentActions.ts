"use server";

import {revalidatePath} from "next/cache";

import connectDB from "@/lib/db";
import NotificationModel from "@/models/notificationModel";
import CommentModel from "@/models/commentModel";

import getServerUser from "./getServerUser";

interface CreateCommentParams {
  message: string;
  postId: string;
  postOwnerId: string;
  path: string;
}

interface ReplyCommentParams {
  postId: string;
  message: string;
  commentId: string;
  path: string;
}

interface DeleteCommentParams {
  commentId: string;
  postId: string;
  path: string;
}

export async function getComments(postId: string) {
  try {
    connectDB();

    const comments = await CommentModel.find({postId, parentComment: null})
      .sort({_id: 1})
      .populate({path: "replies"})
      .populate({
        path: "postedBy",
        select: "_id name email username profileImage",
      });

    return JSON.parse(JSON.stringify(comments));
  } catch (error: any) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
}

export async function createComment({
  message,
  postId,
  postOwnerId,
  path,
}: CreateCommentParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const newComment = new CommentModel({
      postedBy: user._id,
      postId,
      message,
    });

    await newComment.save();

    if (postOwnerId != user._id) {
      await NotificationModel.create({
        from: user._id,
        user: postOwnerId,
        message: `${user.name} comment on your post!`,
        url: `${process.env.NEXTAUTH_URL}/post/${postId}`,
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
}

export async function replyComment({
  postId,
  message,
  commentId,
  path,
}: ReplyCommentParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const newComment = new CommentModel({
      postedBy: user._id,
      postId,
      message,
      parentComment: commentId,
    });

    await newComment.save();

    await CommentModel.findOneAndUpdate(
      {_id: commentId, postId},
      {$push: {replies: newComment._id}}
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to reply comment: ${error.message}`);
  }
}

export async function deleteComment({
  commentId,
  postId,
  path,
}: DeleteCommentParams) {
  try {
    connectDB();

    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized.");

    const comment = await CommentModel.findOne({_id: commentId, postId});
    if (comment && comment.postedBy.toString() === user._id) {
      await CommentModel.deleteMany({_id: {$in: comment.replies}});
      await CommentModel.deleteOne({_id: commentId});
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}
