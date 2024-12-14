"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {dislikePost, likePost} from "@/actions/postActions";
import {IPost} from "@/models/postModel";

import {useToast} from "./use-toast";

interface UseLikeProps {
  postId: string;
  userId: any;
  data: IPost;
}

export default function useLike({postId, userId, data}: UseLikeProps) {
  const path = usePathname();

  const {toast} = useToast();

  const hasLiked = useMemo(() => {
    const list = data?.likes || [];
    return list.includes(userId);
  }, [data, userId]);

  const toggleLike = useCallback(async () => {
    try {
      if (hasLiked) {
        dislikePost({postId, path});
        toast({
          title: "Dislike successful!",
        });
      } else {
        likePost({postId, postUserId: data.user._id, path});
        toast({
          title: "Liked successful!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Like failed!",
        variant: "destructive",
      });
    }
  }, [userId, hasLiked, postId]);

  return {
    hasLiked,
    toggleLike,
  };
}
