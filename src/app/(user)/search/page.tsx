import getServerUser from "@/actions/getServerUser";
import {getUser, searchUsers} from "@/actions/userActions";
import SearchBar from "@/components/search-bar";

import SearchUsers from "./_components/search-users";

export const metadata = {
  title: "Search User",
};

interface SearchUserProps {
  searchParams: {[key: string]: string | string[] | undefined};
}

const SearchUser = async ({searchParams}: SearchUserProps) => {
  const {page, query} = await searchParams;

  const users = await searchUsers({
    searchString: (query as string) || "",
    pageNumber: Number(page) || 1,
    pageSize: 5,
  });

  const currentUser = await getServerUser();
  if (!currentUser) return null;

  const currentUserDetails = await getUser(currentUser?._id);
  if (!currentUserDetails) return null;

  return (
    <div className="mx-auto my-20 w-[95%] rounded p-8 shadow shadow-black dark:shadow-white">
      <h2 className="mb-4 text-3xl font-bold">Search Users</h2>
      <div className="mb-4">
        <SearchBar placeholder="Search users" />
      </div>
      <SearchUsers
        data={users?.data}
        emptyTitle="No user found"
        emptyStateSubtext="Try again later"
        page={Number(page) || 1}
        totalPages={users?.totalPages}
        currentUser={currentUserDetails}
      />
    </div>
  );
};

export default SearchUser;
