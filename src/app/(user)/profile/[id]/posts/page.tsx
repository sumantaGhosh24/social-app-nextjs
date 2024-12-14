import {redirect} from "next/navigation";

import {getUser} from "@/actions/userActions";
import {getUserPosts} from "@/actions/postActions";
import getServerUser from "@/actions/getServerUser";
import PostFeed from "@/app/(user)/_components/post-feed";
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
        <TabsContent value="audio">Change your password here.</TabsContent>
        <TabsContent value="video">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
};

export default UserPosts;
