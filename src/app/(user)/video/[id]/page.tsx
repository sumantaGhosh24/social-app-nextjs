import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getVideo, getVideoLikes} from "@/actions/videoActions";
import {getComments} from "@/actions/commentActions";

import VideoDetails from "./_components/video-details";

export const metadata = {
  title: "Video",
};

interface VideoProps {
  params: {id: string};
}

const Video = async ({params}: VideoProps) => {
  const {id} = await params;

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const video = await getVideo(id);
  if (!video) redirect("/");

  const likes = await getVideoLikes(id);

  const comments = await getComments(id);

  return (
    <>
      <VideoDetails
        video={video}
        user={JSON.parse(JSON.stringify(currentUser))}
        likes={likes?.likes}
        comments={comments}
      />
    </>
  );
};

export default Video;
