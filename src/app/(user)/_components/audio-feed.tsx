import {IAudio} from "@/models/audioModel";
import {IUser} from "@/models/userModel";
import Pagination from "@/components/pagination";

import AudioCard from "./audio-card";

interface AudioFeedProps {
  data: IAudio[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
  user: IUser;
}

const AudioFeed = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  user,
}: AudioFeedProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.map((audio) => (
            <AudioCard key={audio._id} audio={audio} user={user} />
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

export default AudioFeed;
