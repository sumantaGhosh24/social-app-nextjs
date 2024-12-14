import {IUser} from "@/models/userModel";
import {ScrollArea} from "@/components/ui/scroll-area";

import ProfileCard from "./profile-card";

interface FollowBarType {
  users: IUser[];
  currentUser: IUser;
}

const FollowBar = ({users, currentUser}: FollowBarType) => {
  if (users.length === 0) return null;

  const filterUsers = users.filter((el: any) => el._id != currentUser._id);

  return (
    <div className="bg-gray-200 dark:bg-gray-700 h-screen mb-5 md:mb-0 md:h-screen w-full md:w-1/4">
      <div className="px-3 py-5">
        <h2 className="text-xl font-semibold">Who to follow</h2>
        <ScrollArea className="flex flex-col rounded-md px-2 h-[40vh] md:h-[80vh] mt-5">
          {filterUsers.map((user) => (
            <ProfileCard key={user._id} user={user} currentUser={currentUser} />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default FollowBar;
