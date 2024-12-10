import {IUser} from "@/models/userModel";
import Pagination from "@/components/pagination";

import ProfileCard from "../../_components/profile-card";

interface SearchUsersProps {
  data: IUser[];
  emptyTitle: string;
  emptyStateSubtext: string;
  page: number;
  totalPages: number;
  currentUser: IUser;
}

const SearchUsers = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages,
  currentUser,
}: SearchUsersProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col gap-5">
          {data.map((user) => (
            <ProfileCard user={user} currentUser={currentUser} key={user._id} />
          ))}
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
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

export default SearchUsers;
