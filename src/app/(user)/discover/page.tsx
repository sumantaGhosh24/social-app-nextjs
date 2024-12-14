import getServerUser from "@/actions/getServerUser";
import {getDiscoverPosts} from "@/actions/postActions";
import {getUserSuggestions} from "@/actions/userActions";

import FollowBar from "../_components/follow-bar";
import PostFeed from "../_components/post-feed";

export const metadata = {
  title: "Discover",
};

interface DiscoverProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function Discover({searchParams}: DiscoverProps) {
  const {page} = await searchParams;

  const user = await getServerUser();
  const posts = await getDiscoverPosts({pageNumber: Number(page) || 1});
  const users = await getUserSuggestions();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full mb-5 md:mb-0 md:w-3/4">
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
