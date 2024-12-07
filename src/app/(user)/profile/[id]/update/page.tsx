import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";
import {getUser} from "@/actions/userActions";

import UpdateProfileForm from "../_components/update-profile-form";

export const metadata = {
  title: "Update Profile",
};

interface UpdateProfileProps {
  params: {id: string};
}

const UpdateProfile = async ({params}: UpdateProfileProps) => {
  const {id: profileId} = await params;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  const user = await getUser(serverUser?._id);
  if (!user) redirect("/");

  return (
    <>
      <UpdateProfileForm user={user} />
    </>
  );
};

export default UpdateProfile;
