import {redirect} from "next/navigation";

import {getUser} from "@/actions/userActions";
import getServerUser from "@/actions/getServerUser";

import ProfileDetails from "./_components/profile-details";

export const metadata = {
  title: "Profile",
};

interface ProfileProps {
  params: {id: string};
}

const Profile = async ({params}: ProfileProps) => {
  const {id} = await params;

  const user = await getUser(id);
  if (!user) redirect("/");

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const currentUserDetails = await getUser(currentUser?._id);
  if (!currentUserDetails) return null;

  return (
    <>
      <ProfileDetails user={user} currentUser={currentUserDetails} />
    </>
  );
};

export default Profile;
