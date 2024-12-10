"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {follow, unfollow} from "@/actions/userActions";
import {IUser} from "@/models/userModel";

import {useToast} from "./use-toast";

interface UseFollowType {
  userId: string;
  currentUser: IUser;
}

export default function useFollow({userId, currentUser}: UseFollowType) {
  const {toast} = useToast();

  const path = usePathname();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followings || [];
    return list.includes(userId);
  }, [currentUser, userId]);

  const toggleFollow = useCallback(async () => {
    try {
      if (isFollowing) {
        unfollow(userId, path);
        toast({
          title: "Unfollow successful!",
        });
      } else {
        follow(userId, path);
        toast({
          title: "Follow successful!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Follow failed!",
        variant: "destructive",
      });
    }
  }, [currentUser, isFollowing, userId]);

  return {
    isFollowing,
    toggleFollow,
  };
}
