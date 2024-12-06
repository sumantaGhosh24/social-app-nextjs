import Link from "next/link";

import RegisterForm from "../_components/register-form";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href={"/login"} className="text-sm text-blue-800 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
