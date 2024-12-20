import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getLikedPosts} from "@/actions/postActions";
import {getLikedAudios} from "@/actions/audioActions";
import {getLikedVideos} from "@/actions/videoActions";
import PostFeed from "@/app/(user)/_components/post-feed";
import AudioFeed from "@/app/(user)/_components/audio-feed";
import VideoFeed from "@/app/(user)/_components/video-feed";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const metadata = {
  title: "Liked Posts",
};

interface LikedPostProps {
  params: {id: string};
  searchParams: {[key: string]: string | string[] | undefined};
}

const LikedPost = async ({params, searchParams}: LikedPostProps) => {
  const {id: profileId} = await params;
  const {page} = await searchParams;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  const posts = await getLikedPosts({pageNumber: Number(page) || 1});

  const audios = await getLikedAudios({pageNumber: Number(page) || 1});

  const videos = await getLikedVideos({pageNumber: Number(page) || 1});

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

export default LikedPost;
