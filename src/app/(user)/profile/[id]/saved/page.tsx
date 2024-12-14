import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getSavedPosts} from "@/actions/postActions";
import PostFeed from "@/app/(user)/_components/post-feed";
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
        <TabsContent value="audio">Change your password here.</TabsContent>
        <TabsContent value="video">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
};

export default SavedPost;
