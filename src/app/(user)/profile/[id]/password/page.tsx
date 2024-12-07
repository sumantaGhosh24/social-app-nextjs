import {redirect} from "next/navigation";

import getServerUser from "@/actions/getServerUser";

import ResetPasswordForm from "../_components/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

interface ResetPasswordProps {
  params: {id: string};
}

const ResetPassword = async ({params}: ResetPasswordProps) => {
  const {id: profileId} = await params;

  const serverUser = await getServerUser();

  if (!profileId || !serverUser?._id) return null;

  if (profileId !== serverUser?._id) redirect(`/profile/${profileId}`);

  return (
    <>
      <ResetPasswordForm userId={serverUser?._id} />
    </>
  );
};

export default ResetPassword;
