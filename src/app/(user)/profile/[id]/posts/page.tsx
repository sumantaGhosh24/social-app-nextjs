import {redirect} from "next/navigation";

import {getUser} from "@/actions/userActions";
import {getUserPosts} from "@/actions/postActions";
import {getUserAudios} from "@/actions/audioActions";
import {getUserVideos} from "@/actions/videoActions";
import getServerUser from "@/actions/getServerUser";
import PostFeed from "@/app/(user)/_components/post-feed";
import AudioFeed from "@/app/(user)/_components/audio-feed";
import VideoFeed from "@/app/(user)/_components/video-feed";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export const metadata = {
  title: "User Posts",
};

interface UserPostsProps {
  params: {id: string};
  searchParams: {[key: string]: string | string[] | undefined};
}

const UserPosts = async ({params, searchParams}: UserPostsProps) => {
  const {id} = await params;
  const {page} = await searchParams;

  const user = await getUser(id);
  if (!user) redirect("/");

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const posts = await getUserPosts({id, pageNumber: Number(page) || 1});

  const audios = await getUserAudios({id, pageNumber: Number(page) || 1});

  const videos = await getUserVideos({id, pageNumber: Number(page) || 1});

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
            user={JSON.parse(JSON.stringify(currentUser))}
          />
        </TabsContent>
        <TabsContent value="audio">
          <AudioFeed
            data={audios?.data}
            emptyTitle="No audio found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={audios?.totalPages}
            user={JSON.parse(JSON.stringify(currentUser))}
          />
        </TabsContent>
        <TabsContent value="video">
          <VideoFeed
            data={videos?.data}
            emptyTitle="No video found"
            emptyStateSubtext="Try again later"
            page={Number(page) || 1}
            totalPages={videos?.totalPages}
            user={JSON.parse(JSON.stringify(currentUser))}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserPosts;
