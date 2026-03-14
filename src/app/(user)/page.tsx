import getServerUser from "@/actions/getServerUser";
import {getPosts} from "@/actions/postActions";
import {getUserSuggestions} from "@/actions/userActions";

import CreatePost from "./_components/create-post";
import PostFeed from "./_components/post-feed";
import FollowBar from "./_components/follow-bar";

export const metadata = {
  title: "Home",
};

interface HomeProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function Home({searchParams}: HomeProps) {
  const {page} = await searchParams;

  const user = await getServerUser();
  const posts = await getPosts({pageNumber: Number(page) || 1});
  const users = await getUserSuggestions();

  return (
    <div className="flex flex-col-reverse md:flex-row container mx-auto">
      <div className="w-full mb-5 md:mb-0 md:w-3/4">
        <CreatePost user={JSON.parse(JSON.stringify(user))} />
        <PostFeed
          data={posts?.data}
          emptyTitle="No post found"
          emptyStateSubtext="Try again later"
          page={Number(page) || 1}
          totalPages={posts?.totalPages}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
      <FollowBar users={users} currentUser={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
