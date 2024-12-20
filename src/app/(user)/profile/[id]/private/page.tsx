import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getPrivatePost} from "@/actions/postActions";
import {getPrivateAudio} from "@/actions/audioActions";
import {getPrivateVideo} from "@/actions/videoActions";
import PostFeed from "@/app/(user)/_components/post-feed";
import AudioFeed from "@/app/(user)/_components/audio-feed";
import VideoFeed from "@/app/(user)/_components/video-feed";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const metadata = {
  title: "Private Posts",
};

interface PrivatePostProps {
  params: {id: string};
  searchParams: {[key: string]: string | string[] | undefined};
}

const PrivatePost = async ({params, searchParams}: PrivatePostProps) => {
  const {id: profileId} = await params;
  const {page} = await searchParams;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  const posts = await getPrivatePost({pageNumber: Number(page) || 1});

  const audios = await getPrivateAudio({pageNumber: Number(page) || 1});

  const videos = await getPrivateVideo({pageNumber: Number(page) || 1});

  return (
    <>
      <Tabs defaultValue="image" className="w-full ml-5">
        <TabsList>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <PostFeed
            data={posts?.data}
            emptyTitle="No post found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={posts?.totalPages}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
        <TabsContent value="audio">
          <AudioFeed
            data={audios?.data}
            emptyTitle="No audio found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={audios?.totalPages}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
        <TabsContent value="video">
          <VideoFeed
            data={videos?.data}
            emptyTitle="No video found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={videos?.totalPages}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default PrivatePost;
