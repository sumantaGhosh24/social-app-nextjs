"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";
import {Reply, Trash} from "lucide-react";

import {useToast} from "@/hooks/use-toast";
import {IComment} from "@/models/commentModel";
import {deleteComment} from "@/actions/commentActions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

import CreateCommentForm from "./create-comment-form";

interface CommentCardProps {
  comment: IComment;
  user: string;
  postOwnerId: string;
}

const CommentCard = ({comment, user, postOwnerId}: CommentCardProps) => {
  const [replyView, setReplyView] = useState(false);
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const path = usePathname();

  const handleDeleteComment = async () => {
    setLoading(true);

    try {
      await deleteComment({
        commentId: comment._id,
        postId: comment.postId as any,
        path,
      });

      toast({title: "Comment deleted!"});
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

  return (
    <div className="bg-white dark:bg-black p-5 mb-4 mx-2 rounded">
      <div className="flex flex-row items-start gap-3">
        <Avatar>
          <AvatarImage src={comment.postedBy?.profileImage?.url} />
          <AvatarFallback>
            {comment.postedBy?.name?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <div className="flex flex-row items-center gap-2">
            <p className="font-semibold cursor-pointer capitalize hover:underline">
              {comment.postedBy?.name}
            </p>
            <span className="text-neutral-500 cursor-pointer hover:underline">
              @{comment.postedBy?.username}
            </span>
            <span className="text-neutral-500 text-sm">
              {formatDistanceToNowStrict(comment.createdAt)}
            </span>
          </div>
          <div className="mt-1">{comment.message}</div>
          <div className="mt-3">
            <div className="flex items-center">
              <Button
                size="icon"
                onClick={() => setReplyView(!replyView)}
                className="bg-blue-700 hover:bg-blue-700/80 mr-10"
              >
                <Reply />
              </Button>
              {comment.postedBy._id === user && (
                <Button
                  size="icon"
                  className="bg-red-700 hover:bg-red-700/80 disabled:bg-red-300"
                  disabled={loading}
                  onClick={() => handleDeleteComment()}
                >
                  <Trash />
                </Button>
              )}
            </div>
            {replyView && (
              <>
                <CreateCommentForm
                  postId={comment.postId as any}
                  postOwnerId={postOwnerId}
                  commentId={comment._id}
                />
                {comment.replies.length > 0 &&
                  comment.replies.map((c) => (
                    <CommentCard
                      key={c._id}
                      comment={c}
                      user={user}
                      postOwnerId={postOwnerId}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
