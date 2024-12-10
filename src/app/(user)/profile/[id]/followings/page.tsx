import {redirect} from "next/navigation";

import {getFollowings, getUser} from "@/actions/userActions";
import getServerUser from "@/actions/getServerUser";

import Users from "../_components/users";

export const metadata = {
  title: "Followings",
};

interface FollowingsProps {
  params: {id: string};
}

const Followings = async ({params}: FollowingsProps) => {
  const {id} = await params;

  const user = await getUser(id);
  if (!user) redirect("/");

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const currentUserDetails = await getUser(currentUser?._id);
  if (!currentUserDetails) return null;

  const followings = await getFollowings(id);

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <h2 className="mb-4 text-3xl font-bold">Followings</h2>
      <Users
        data={followings.followings}
        emptyTitle="No followings found"
        emptyStateSubtext="Try again later"
        currentUser={currentUserDetails}
      />
    </div>
  );
};

export default Followings;
