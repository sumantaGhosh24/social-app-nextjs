import {redirect} from "next/navigation";

import {getUser} from "@/actions/userActions";

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

  return (
    <>
      <ProfileDetails user={user} />
    </>
  );
};

export default Profile;
