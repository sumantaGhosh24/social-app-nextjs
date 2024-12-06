"use client";

import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {usePrimaryColor} from "@/components/primary-provider";

const NotFound = () => {
  const router = useRouter();
  const {primaryColor} = usePrimaryColor();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[60%] h-[450px] flex flex-col justify-center items-center gap-5 rounded-md shadow-md dark:shadow-white">
        <h1 className="text-4xl font-bold">Page not found!</h1>
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

export default NotFound;
