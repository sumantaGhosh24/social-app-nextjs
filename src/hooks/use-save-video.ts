"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {saveVideo, unSaveVideo} from "@/actions/videoActions";
import {IUser} from "@/models/userModel";

import {useToast} from "./use-toast";

interface UseSaveProps {
  videoId: any;
  currentUser: IUser;
}

export default function useSaveVideo({videoId, currentUser}: UseSaveProps) {
  const {toast} = useToast();

  const path = usePathname();

  const isSave = useMemo(() => {
    const list = currentUser?.videoSaved || [];
    return list.includes(videoId);
  }, [currentUser, videoId]);

  const toggleSave = useCallback(async () => {
    try {
      if (isSave) {
        unSaveVideo({videoId, path});
        toast({
          title: "Unsave successful!",
        });
      } else {
        saveVideo({videoId, path});
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
  }, [currentUser, isSave, videoId]);

  return {
    isSave,
    toggleSave,
  };
}
