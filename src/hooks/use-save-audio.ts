"use client";

import {useMemo, useCallback} from "react";
import {usePathname} from "next/navigation";

import {saveAudio, unSaveAudio} from "@/actions/audioActions";
import {IUser} from "@/models/userModel";

import {useToast} from "./use-toast";

interface UseSaveProps {
  audioId: any;
  currentUser: IUser;
}

export default function useSaveAudio({audioId, currentUser}: UseSaveProps) {
  const {toast} = useToast();

  const path = usePathname();

  const isSave = useMemo(() => {
    const list = currentUser?.audioSaved || [];
    return list.includes(audioId);
  }, [currentUser, audioId]);

  const toggleSave = useCallback(async () => {
    try {
      if (isSave) {
        unSaveAudio({audioId, path});
        toast({
          title: "Unsave successful!",
        });
      } else {
        saveAudio({audioId, path});
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
  }, [currentUser, isSave, audioId]);

  return {
    isSave,
    toggleSave,
  };
}
