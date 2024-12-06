import {getServerSession} from "next-auth";

import {options} from "@/lib/auth";

const getServerUser = async () => {
  const session = await getServerSession(options);
  return session?.user;
};

export default getServerUser;
