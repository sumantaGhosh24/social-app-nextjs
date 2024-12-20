import {getDiscoverVideos} from "@/actions/videoActions";
import {getUserSuggestions} from "@/actions/userActions";
import getServerUser from "@/actions/getServerUser";

import FollowBar from "../_components/follow-bar";
import VideoFeed from "../_components/video-feed";

export const metadata = {
  title: "Discover Videos",
};

interface DiscoverVideosProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function DiscoverVideos({
  searchParams,
}: DiscoverVideosProps) {
  const {page} = await searchParams;

  const user = await getServerUser();
  const videos = await getDiscoverVideos({pageNumber: Number(page) || 1});
  const users = await getUserSuggestions();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full mb-5 md:mb-0 md:w-3/4">
        <VideoFeed
          data={videos?.data}
          emptyTitle="No video found"
          emptyStateSubtext="Try again later"
          page={Number(page) || 1}
          totalPages={videos?.totalPages}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
      <FollowBar users={users} currentUser={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
