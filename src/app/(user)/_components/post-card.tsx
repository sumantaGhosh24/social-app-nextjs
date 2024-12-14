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

import {updatePostPublic} from "@/actions/postActions";
import useLike from "@/hooks/use-like";
import useSave from "@/hooks/use-save";
import {IPost} from "@/models/postModel";
import {IUser} from "@/models/userModel";
import {FRONTEND_URL} from "@/lib/config";
import DialogProvider from "@/components/dialog-provider";
import {useToast} from "@/hooks/use-toast";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
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

interface PostCardProps {
  post: IPost;
  user: IUser;
}

const PostCard = ({post, user}: PostCardProps) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
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

  const goToUser = () => {
    router.push(`/profile/${post.user?._id}`);
  };

  const goToPost = () => {
    router.push(`/post/${post._id}`);
  };

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
    <div className="bg-gray-100 p-5 cursor-pointer hover:bg-gray-200 dark:bg-gray-700 mb-4 mx-2 rounded">
      <div className="flex flex-row items-start gap-3">
        <Avatar>
          <AvatarImage src={post.user?.profileImage?.url} />
          <AvatarFallback>{post.user?.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="flex flex-row items-center gap-2" onClick={goToUser}>
            <p className="font-semibold cursor-pointer capitalize hover:underline">
              {post.user?.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline">
              @{post.user?.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(post.createdAt)}
            </span>
          </div>
          <div className="mt-1" onClick={goToPost}>
            {post.title}
          </div>
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
                    onClick={goToPost}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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
    </div>
  );
};

export default PostCard;
