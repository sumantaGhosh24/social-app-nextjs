"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {dislikeAudio, likeAudio} from "@/actions/audioActions";
import {IAudio} from "@/models/audioModel";

import {useToast} from "./use-toast";

interface UseLikeProps {
  audioId: string;
  userId: any;
  data: IAudio;
}

export default function useLikeAudio({audioId, userId, data}: UseLikeProps) {
  const path = usePathname();

  const {toast} = useToast();

  const hasLiked = useMemo(() => {
    const list = data?.likes || [];
    return list.includes(userId);
  }, [data, userId]);

  const toggleLike = useCallback(async () => {
    try {
      if (hasLiked) {
        dislikeAudio({audioId, path});
        toast({
          title: "Dislike successful!",
        });
      } else {
        likeAudio({audioId, audioUserId: data.user._id, path});
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
  }, [userId, hasLiked, audioId]);

  return {
    hasLiked,
    toggleLike,
  };
}
