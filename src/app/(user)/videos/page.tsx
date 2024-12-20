import getServerUser from "@/actions/getServerUser";
import {getUserSuggestions} from "@/actions/userActions";
import {getVideos} from "@/actions/videoActions";

import CreateVideo from "./_components/create-video";
import VideoFeed from "../_components/video-feed";
import FollowBar from "../_components/follow-bar";

export const metadata = {
  title: "Videos",
};

interface VideosProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function Videos({searchParams}: VideosProps) {
  const {page} = await searchParams;

  const user = await getServerUser();
  const videos = await getVideos({pageNumber: Number(page) || 1});
  const users = await getUserSuggestions();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full mb-5 md:mb-0 md:w-3/4">
        <CreateVideo user={JSON.parse(JSON.stringify(user))} />
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
