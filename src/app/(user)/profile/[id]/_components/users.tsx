import {IUser} from "@/models/userModel";
import ProfileCard from "@/app/(user)/_components/profile-card";

interface UsersProps {
  data: IUser[];
  emptyTitle: string;
  emptyStateSubtext: string;
  currentUser: IUser;
}

const Users = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  currentUser,
}: UsersProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.map((user) => (
            <ProfileCard user={user} currentUser={currentUser} key={user._id} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 rounded-[14px] bg-white py-28 text-center shadow shadow-black dark:bg-black dark:shadow-white">
          <h3 className="text-xl font-bold">{emptyTitle}</h3>
          <p>{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Users;
