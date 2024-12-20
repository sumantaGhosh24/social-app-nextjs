import {IVideo} from "@/models/videoModel";
import {IUser} from "@/models/userModel";
import Pagination from "@/components/pagination";

import VideoCard from "./video-card";

interface VideoFeedProps {
  data: IVideo[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
  user: IUser;
}

const VideoFeed = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  user,
}: VideoFeedProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.map((video) => (
            <VideoCard key={video._id} video={video} user={user} />
          ))}
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
        </div>
      ) : (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
          <h3 className="text-xl font-bold">{emptyTitle}</h3>
          <p>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default VideoFeed;
