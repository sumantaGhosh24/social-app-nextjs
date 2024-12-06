"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {usePrimaryColor} from "@/components/primary-provider";

const ErrorState = ({error}: {error: any}) => {
  const router = useRouter();
  const {primaryColor} = usePrimaryColor();

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[60%] h-[450px] flex flex-col justify-center items-center gap-5 rounded-md shadow-md dark:shadow-white">
        <h1 className="text-4xl font-bold">Something went wrong!</h1>
        <h3>{error.message}</h3>
        <Button
          className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800`}
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
