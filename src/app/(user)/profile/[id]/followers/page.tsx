import {redirect} from "next/navigation";

import {getFollowers, getUser} from "@/actions/userActions";
import getServerUser from "@/actions/getServerUser";

import Users from "../_components/users";

export const metadata = {
  title: "Followers",
};

interface FollowersProps {
  params: {id: string};
}

const Followers = async ({params}: FollowersProps) => {
  const {id} = await params;

  const user = await getUser(id);
  if (!user) redirect("/");

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const currentUserDetails = await getUser(currentUser?._id);
  if (!currentUserDetails) return null;

  const followers = await getFollowers(id);

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <h2 className="mb-4 text-3xl font-bold">Followers</h2>
      <Users
        data={followers.followers}
        emptyTitle="No followers found"
        emptyStateSubtext="Try again later"
        currentUser={currentUserDetails}
      />
    </div>
  );
};

export default Followers;
