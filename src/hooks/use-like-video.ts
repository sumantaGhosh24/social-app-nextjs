"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {dislikeVideo, likeVideo} from "@/actions/videoActions";
import {IVideo} from "@/models/videoModel";

import {useToast} from "./use-toast";

interface UseLikeProps {
  videoId: string;
  userId: any;
  data: IVideo;
}

export default function useLikeVideo({videoId, userId, data}: UseLikeProps) {
  const path = usePathname();

  const {toast} = useToast();

  const hasLiked = useMemo(() => {
    const list = data?.likes || [];
    return list.includes(userId);
  }, [data, userId]);

  const toggleLike = useCallback(async () => {
    try {
      if (hasLiked) {
        dislikeVideo({videoId, path});
        toast({
          title: "Dislike successful!",
        });
      } else {
        likeVideo({videoId, videoUserId: data.user._id, path});
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
  }, [userId, hasLiked, videoId]);

  return {
    hasLiked,
    toggleLike,
  };
}
