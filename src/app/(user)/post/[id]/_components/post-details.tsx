"use client";

import {useState} from "react";
import Image from "next/image";
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

import {updatePostPublic} from "@/actions/postActions";
import useLike from "@/hooks/use-like";
import useSave from "@/hooks/use-save";
import {IPost} from "@/models/postModel";
import {IUser} from "@/models/userModel";
import {IComment} from "@/models/commentModel";
import {FRONTEND_URL} from "@/lib/config";
import ProfileCard from "@/app/(user)/_components/profile-card";
import DialogProvider from "@/components/dialog-provider";
import {useToast} from "@/hooks/use-toast";
import {
  CarouselNext,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import CreateCommentForm from "./create-comment-form";
import CommentCard from "./comments-card";

interface PostDetailsProps {
  post: IPost;
  user: IUser;
  likes: IUser[];
  comments: IComment[];
}

const PostDetails = ({post, user, likes, comments}: PostDetailsProps) => {
  const [loading, setLoading] = useState(false);

  const path = usePathname();

  const {toast} = useToast();

  const {hasLiked, toggleLike} = useLike({
    postId: post._id,
    userId: user._id,
    data: post,
  });

  const {isSave, toggleSave} = useSave({
    postId: post._id,
    currentUser: user,
  });

  const handleToggleVisibility = async () => {
    setLoading(true);

    try {
      await updatePostPublic({id: post._id, isPublic: !post.public, path});

      toast({title: "Successfully change post visibility!"});
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
      {post.title && (
        <h2 className="text-xl font-bold capitalize">{post.title}</h2>
      )}
      <Carousel>
        <CarouselContent>
          {post.image.map((img) => (
            <CarouselItem key={img.public_id}>
              <Image
                src={img.url}
                height={400}
                width={1000}
                alt={img.public_id}
                placeholder="blur"
                blurDataURL={img.blurHash}
                priority
                className="w-full h-[350px] my-3 rounded"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex flex-row items-start gap-3 mb-5">
        <div className="w-full">
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              onClick={onLike}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer"
            >
              {LikeIcon}
              <p>{post?.likes?.length || 0}</p>
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
              title="Share Post"
              description="Share post to grow our community"
            >
              <ShareSocial
                url={`${FRONTEND_URL}/post/${post._id}`}
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
            {post.user?._id === user._id && (
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
                    <span>Change to {post.public ? "Private" : "Public"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <ProfileCard user={post.user} currentUser={user} />
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
          <CreateCommentForm postId={post._id} postOwnerId={post.user?._id} />
          {comments.length > 0 ? (
            <div className="p-3">
              <h2 className="text-2xl font-bold mb-5">Comments</h2>
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  user={user._id}
                  postOwnerId={post.user?._id}
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

export default PostDetails;
