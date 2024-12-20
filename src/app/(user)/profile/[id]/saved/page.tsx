import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getSavedPosts} from "@/actions/postActions";
import {getSavedAudios} from "@/actions/audioActions";
import {getSavedVideos} from "@/actions/videoActions";
import PostFeed from "@/app/(user)/_components/post-feed";
import AudioFeed from "@/app/(user)/_components/audio-feed";
import VideoFeed from "@/app/(user)/_components/video-feed";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const metadata = {
  title: "Saved Posts",
};

interface SavedPostProps {
  params: {id: string};
}

const SavedPost = async ({params}: SavedPostProps) => {
  const {id: profileId} = await params;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  const posts = await getSavedPosts();

  const audios = await getSavedAudios();

  const videos = await getSavedVideos();

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
            data={posts?.saved}
            emptyTitle="No post found"
            emptyStateSubtext="Try again later"
            page={1}
            totalPages={1}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
        <TabsContent value="audio">
          <AudioFeed
            data={audios?.audioSaved}
            emptyTitle="No audio found"
            emptyStateSubtext="Try again later"
            page={1}
            totalPages={1}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
        <TabsContent value="video">
          <VideoFeed
            data={videos?.videoSaved}
            emptyTitle="No video found"
            emptyStateSubtext="Try again later"
            page={1}
            totalPages={1}
            user={JSON.parse(JSON.stringify(serverUser))}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default SavedPost;
