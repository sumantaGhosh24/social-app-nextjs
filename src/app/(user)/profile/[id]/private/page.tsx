import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getPrivatePost} from "@/actions/postActions";
import PostFeed from "@/app/(user)/_components/post-feed";
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
        <TabsContent value="audio">Change your password here.</TabsContent>
        <TabsContent value="video">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
};

export default PrivatePost;
