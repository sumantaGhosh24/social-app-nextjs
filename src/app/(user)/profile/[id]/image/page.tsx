import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getUser} from "@/actions/userActions";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import ProfileImageForm from "../_components/profile-image-form";
import CoverImageForm from "../_components/cover-image-form";

export const metadata = {
  title: "Update Profile Image",
};

interface UpdateProfileImageProps {
  params: {id: string};
}

const UpdateProfileImage = async ({params}: UpdateProfileImageProps) => {
  const {id: profileId} = await params;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  const user = await getUser(serverUser?._id);
  if (!user) redirect("/");

  return (
    <>
      <Tabs defaultValue="profile-image" className="w-full">
        <TabsList className="mx-10 mt-10 grid grid-cols-2">
          <TabsTrigger value="profile-image">Update Profile Image</TabsTrigger>
          <TabsTrigger value="cover-image">Update Cover Image</TabsTrigger>
        </TabsList>
        <TabsContent value="profile-image">
          <ProfileImageForm user={user} />
        </TabsContent>
        <TabsContent value="cover-image">
          <CoverImageForm user={user} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UpdateProfileImage;
