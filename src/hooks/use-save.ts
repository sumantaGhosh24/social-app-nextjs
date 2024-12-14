"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {savePost, unSavePost} from "@/actions/postActions";
import {IUser} from "@/models/userModel";

import {useToast} from "./use-toast";

interface UseSaveProps {
  postId: any;
  currentUser: IUser;
}

export default function useSave({postId, currentUser}: UseSaveProps) {
  const {toast} = useToast();

  const path = usePathname();

  const isSave = useMemo(() => {
    const list = currentUser?.saved || [];
    return list.includes(postId);
  }, [currentUser, postId]);

  const toggleSave = useCallback(async () => {
    try {
      if (isSave) {
        unSavePost({postId, path});
        toast({
          title: "Unsave successful!",
        });
      } else {
        savePost({postId, path});
        toast({
          title: "Save successful!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Save failed!",
        variant: "destructive",
      });
    }
  }, [currentUser, isSave, postId]);

  return {
    isSave,
    toggleSave,
  };
}
