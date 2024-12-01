"use client";

import {Button} from "@/components/ui/button";

import {ModeToggle} from "./_components/mode-toggle";
import {usePrimaryColor} from "./_components/primary-provider";
import PrimaryToggle from "./_components/primary-toggle";

export default function Home() {
  const {primaryColor} = usePrimaryColor();

  return (
    <div>
      <h1 className={`text-${primaryColor}-500`}>Hello World</h1>
      <Button
        className={`bg-${primaryColor}-700 hover:bg-${primaryColor}-800 disabled:bg-${primaryColor}-300`}
      >
        Click Me
      </Button>
      <ModeToggle />
      <PrimaryToggle />
    </div>
  );
}
