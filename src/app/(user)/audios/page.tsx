import getServerUser from "@/actions/getServerUser";
import {getAudios} from "@/actions/audioActions";
import {getUserSuggestions} from "@/actions/userActions";

import CreateAudio from "./_components/create-audio";
import AudioFeed from "../_components/audio-feed";
import FollowBar from "../_components/follow-bar";

export const metadata = {
  title: "Audios",
};

interface AudiosProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

export default async function Audios({searchParams}: AudiosProps) {
  const {page} = await searchParams;

  const user = await getServerUser();
  const audios = await getAudios({pageNumber: Number(page) || 1});
  const users = await getUserSuggestions();

  return (
    <div className="flex flex-col-reverse md:flex-row">
      <div className="w-full mb-5 md:mb-0 md:w-3/4">
        <CreateAudio user={JSON.parse(JSON.stringify(user))} />
        <AudioFeed
          data={audios?.data}
          emptyTitle="No audio found"
          emptyStateSubtext="Try again later"
          page={Number(page) || 1}
          totalPages={audios?.totalPages}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
      <FollowBar users={users} currentUser={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
