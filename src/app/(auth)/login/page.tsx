import Link from "next/link";

import LoginForm from "../_components/login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={"/register"}
          className="text-sm text-blue-800 hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  );
}
