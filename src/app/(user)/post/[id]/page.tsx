import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getPost, getPostLikes} from "@/actions/postActions";
import {getComments} from "@/actions/commentActions";

import PostDetails from "./_components/post-details";

export const metadata = {
  title: "Post",
};

interface PostProps {
  params: {id: string};
}

const Post = async ({params}: PostProps) => {
  const {id} = await params;

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const post = await getPost(id);
  if (!post) redirect("/");

  const likes = await getPostLikes(id);

  const comments = await getComments(id);

  return (
    <>
      <PostDetails
        post={post}
        user={JSON.parse(JSON.stringify(currentUser))}
        likes={likes?.likes}
        comments={comments}
      />
    </>
  );
};

export default Post;
