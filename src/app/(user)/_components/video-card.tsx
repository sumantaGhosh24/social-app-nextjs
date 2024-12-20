"use client";

import {useState} from "react";
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

import {updateVideoPublic} from "@/actions/videoActions";
import useLikeVideo from "@/hooks/use-like-video";
import useSaveVideo from "@/hooks/use-save-video";
import {IVideo} from "@/models/videoModel";
import {IUser} from "@/models/userModel";
import {FRONTEND_URL} from "@/lib/config";
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

interface VideoCardProps {
  video: IVideo;
  user: IUser;
}

const VideoCard = ({video, user}: VideoCardProps) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const path = usePathname();

  const {toast} = useToast();

  const {hasLiked, toggleLike} = useLikeVideo({
    videoId: video._id,
    userId: user._id,
    data: video,
  });

  const {isSave, toggleSave} = useSaveVideo({
    videoId: video._id,
    currentUser: user,
  });

  const goToUser = () => {
    router.push(`/profile/${video.user?._id}`);
  };

  const goToVideo = () => {
    router.push(`/video/${video._id}`);
  };

  const handleToggleVisibility = async () => {
    setLoading(true);

    try {
      await updateVideoPublic({id: video._id, isPublic: !video.public, path});

      toast({title: "Successfully change video visibility!"});
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
          <AvatarImage src={video.user?.profileImage?.url} />
          <AvatarFallback>{video.user?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="flex flex-row items-center gap-2" onClick={goToUser}>
            <p className="font-semibold cursor-pointer capitalize hover:underline">
              {video.user?.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline">
              @{video.user?.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(video.createdAt)}
            </span>
          </div>
          <div className="mt-1" onClick={goToVideo}>
            {video.title}
          </div>
          <video
            controls
            poster={video.thumbnail.url}
            className="w-full rounded mt-2"
          >
            <source src={video.video.url} type="video/mp4" />
            <source src={video.video.url} type="video/webm" />
            <source src={video.video.url} type="video/ogg" />
          </video>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              onClick={onLike}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer"
            >
              {LikeIcon}
              <p>{video?.likes?.length || 0}</p>
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
              title="Share Video"
              description="Share video to grow our community"
            >
              <ShareSocial
                url={`${FRONTEND_URL}/video/${video._id}`}
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
            {video.user?._id === user._id && (
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
                    <span>Change to {video.public ? "Private" : "Public"}</span>
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

export default VideoCard;
