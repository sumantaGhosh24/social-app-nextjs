"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
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
import {IComment} from "@/models/commentModel";
import {FRONTEND_URL} from "@/lib/config";
import CreateCommentForm from "@/app/(user)/_components/create-comment-form";
import CommentCard from "@/app/(user)/_components/comments-card";
import ProfileCard from "@/app/(user)/_components/profile-card";
import DialogProvider from "@/components/dialog-provider";
import {useToast} from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface VideoDetailsProps {
  video: IVideo;
  user: IUser;
  likes: IUser[];
  comments: IComment[];
}

const VideoDetails = ({video, user, likes, comments}: VideoDetailsProps) => {
  const [loading, setLoading] = useState(false);

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
    <div className="bg-gray-100 p-5 hover:bg-gray-200 dark:bg-gray-700 my-5 mx-3 rounded">
      <h2 className="text-xl font-bold capitalize">{video.title}</h2>
      <video controls poster={video.thumbnail.url} className="w-full rounded">
        <source src={video.video.url} type="video/mp4" />
        <source src={video.video.url} type="video/webm" />
        <source src={video.video.url} type="video/ogg" />
      </video>
      <div className="flex flex-row items-start gap-3 mb-5">
        <div className="w-full">
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
      <ProfileCard user={video.user} currentUser={user} />
      <Tabs defaultValue="comments" className="w-full mt-10">
        <TabsList>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="likes" className="flex flex-col gap-2">
          {likes.map((like) => (
            <ProfileCard key={like._id} user={like} currentUser={user} />
          ))}
        </TabsContent>
        <TabsContent value="comments">
          <CreateCommentForm postId={video._id} postOwnerId={video.user?._id} />
          {comments.length > 0 ? (
            <div className="p-3">
              <h2 className="text-2xl font-bold mb-5">Comments</h2>
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  user={user._id}
                  postOwnerId={video.user?._id}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
              <h3 className="text-xl font-bold">No comment found</h3>
              <p>Try again later</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoDetails;
