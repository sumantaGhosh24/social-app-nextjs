import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getAudio, getAudioLikes} from "@/actions/audioActions";
import {getComments} from "@/actions/commentActions";

import AudioDetails from "./_components/audio-details";

export const metadata = {
  title: "Audio",
};

interface AudioProps {
  params: {id: string};
}

const Audio = async ({params}: AudioProps) => {
  const {id} = await params;

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const audio = await getAudio(id);
  if (!audio) redirect("/");

  const likes = await getAudioLikes(id);

  const comments = await getComments(id);

  return (
    <>
      <AudioDetails
        audio={audio}
        user={JSON.parse(JSON.stringify(currentUser))}
        likes={likes?.likes}
        comments={comments}
      />
    </>
  );
};

export default Audio;
