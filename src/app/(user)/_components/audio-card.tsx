"use client";

import {useState} from "react";
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";
import {
  Heart,
  HeartOff,
  EllipsisVertical,
  Eye,
  SaveOff,
  Save,
  Share,
} from "lucide-react";
import {ShareSocial} from "react-share-social";

import {updateAudioPublic} from "@/actions/audioActions";
import useLikeAudio from "@/hooks/use-like-audio";
import useSaveAudio from "@/hooks/use-save-audio";
import {IAudio} from "@/models/audioModel";
import {IUser} from "@/models/userModel";
import DialogProvider from "@/components/dialog-provider";
import {useToast} from "@/hooks/use-toast";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

interface AudioCardProps {
  audio: IAudio;
  user: IUser;
}

const AudioCard = ({audio, user}: AudioCardProps) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const {toast} = useToast();

  const {hasLiked, toggleLike} = useLikeAudio({
    audioId: audio._id,
    userId: user._id,
    data: audio,
  });

  const {isSave, toggleSave} = useSaveAudio({
    audioId: audio._id,
    currentUser: user,
  });

  const goToUser = () => {
    router.push(`/profile/${audio.user?._id}`);
  };

  const goToAudio = () => {
    router.push(`/audio/${audio._id}`);
  };

  const handleToggleVisibility = async () => {
    setLoading(true);

    try {
      await updateAudioPublic({id: audio._id, isPublic: !audio.public, path});

      toast({title: "Successfully change audio visibility!"});
    } catch (error: any) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onLike = () => {
    toggleLike();
  };

  const onSave = () => {
    toggleSave();
  };

  const LikeIcon = hasLiked ? <Heart color="red" /> : <HeartOff />;

  const SaveIcon = isSave ? <SaveOff /> : <Save />;

  return (
    <div className="bg-gray-100 p-5 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 mb-4 mx-2 rounded">
      <div className="flex flex-row items-start gap-3">
        <Avatar>
          <AvatarImage src={audio.user?.profileImage?.url} />
          <AvatarFallback>{audio.user?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="flex flex-row items-center gap-2" onClick={goToUser}>
            <p className="font-semibold cursor-pointer capitalize hover:underline">
              {audio.user?.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline">
              @{audio.user?.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(audio.createdAt)}
            </span>
          </div>
          <div className="mt-1" onClick={goToAudio}>
            {audio.title}
          </div>
          <Image
            src={audio.thumbnail.url}
            height={400}
            width={400}
            alt={audio.thumbnail.public_id}
            placeholder="blur"
            blurDataURL={audio.thumbnail.blurHash}
            priority
            className="w-[350px] h-[350px] my-3 rounded-full"
            onClick={goToAudio}
          />
          <audio controls>
            <source src={audio.audio.url} type="audio/mpeg" />
            <source src={audio.audio.url} type="audio/ogg" />
            <source src={audio.audio.url} type="audio/wav" />
          </audio>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              onClick={onLike}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer"
            >
              {LikeIcon}
              <p>{audio?.likes?.length || 0}</p>
            </div>
            <div
              onClick={onSave}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer"
            >
              {SaveIcon}
            </div>
            <DialogProvider
              trigger={
                <div className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer">
                  <Share />
                </div>
              }
              title="Share Audio"
              description="Share audio to grow our community"
            >
              <ShareSocial
                url={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/audio/${audio._id}`}
                socialTypes={[
                  "facebook",
                  "twitter",
                  "reddit",
                  "linkedin",
                  "whatsapp",
                  "telegram",
                ]}
              />
            </DialogProvider>
            {audio.user?._id === user._id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    onClick={() => handleToggleVisibility()}
                    disabled={loading}
                    className="cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Eye />
                    <span>Change to {audio.public ? "Private" : "Public"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
