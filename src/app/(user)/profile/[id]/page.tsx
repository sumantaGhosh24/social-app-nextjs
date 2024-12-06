import {redirect} from "next/navigation";

import {getUser} from "@/actions/userActions";

export const metadata = {
  title: "Profile",
};

const Profile = async () => {
  const user = await getUser();
  if (!user) redirect("/");

  return (
    <div>
      <h2>{JSON.stringify(user, null, 4)}</h2>
    </div>
  );
};

export default Profile;
