"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {signOut} from "next-auth/react";
import {Menu, X} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

import {ModeToggle} from "./mode-toggle";
import PrimaryToggle from "./primary-toggle";
import {usePrimaryColor} from "./primary-provider";

const Header = ({user}: {user: any}) => {
  const [open, setOpen] = useState(false);

  const {primaryColor} = usePrimaryColor();

  return (
    <nav
      className={`w-full border-b bg-${primaryColor}-700 shadow shadow-black text-white dark:shadow-white`}
    >
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <Link href="/">
            <Image
              src="https://placehold.co/600x400.png"
              alt="logo"
              height={20}
              width={20}
              className="h-10 w-10 rounded"
            />
          </Link>
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-primary outline-none"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-end pb-3 md:mt-0 md:block md:pb-0 ${
            open ? "block" : "hidden"
          }`}
        >
          <NavigationMenu className="mx-auto">
            <NavigationMenuList className="flex-col gap-2 md:flex-row">
              {user ? (
                <>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Posts</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {[
                            {id: 1, name: "Posts", url: "/"},
                            {id: 2, name: "Videos", url: "/videos"},
                            {id: 3, name: "Audios", url: "/audios"},
                          ].map((item) => (
                            <NavigationMenuItem key={item.id} className="my-3">
                              <Link href={item.url} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className={navigationMenuTriggerStyle()}
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          ))}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {[
                            {id: 1, name: "Discover Posts", url: "/discover"},
                            {
                              id: 2,
                              name: "Discover Videos",
                              url: "/discover-videos",
                            },
                            {
                              id: 3,
                              name: "Discover Audios",
                              url: "/discover-audios",
                            },
                          ].map((item) => (
                            <NavigationMenuItem key={item.id} className="my-3">
                              <Link href={item.url} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className={navigationMenuTriggerStyle()}
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          ))}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {[
                            {
                              id: 1,
                              name: "Profile",
                              url: `/profile/${user._id}`,
                            },
                            {id: 2, name: "My Reviews", url: "/reviews/my"},
                            {id: 3, name: "My Orders", url: "/orders/my"},
                            {
                              id: 4,
                              name: user?.hasNotification
                                ? "Notifications*"
                                : "Notifications",
                              url: "/notifications",
                            },
                            {id: 5, name: "Search Users", url: "/search"},
                          ].map((item) => (
                            <NavigationMenuItem key={item.id} className="my-3">
                              <Link href={item.url} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className={navigationMenuTriggerStyle()}
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          ))}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                  {[
                    {id: 1, name: "Cart", url: "/cart"},
                    {id: 2, name: "Shop", url: "/shop"},
                  ].map((item) => (
                    <NavigationMenuItem key={item.id}>
                      <Link href={item.url} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                  {user.role === "admin" && (
                    <>
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger>
                              Manage
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              {[
                                {id: 1, name: "Users", url: "/users"},
                                {id: 2, name: "Categories", url: "/categories"},
                                {id: 3, name: "Products", url: "/products"},
                                {id: 4, name: "Reviews", url: "/reviews"},
                                {id: 5, name: "Orders", url: "/orders"},
                              ].map((item) => (
                                <NavigationMenuItem
                                  key={item.id}
                                  className="my-3"
                                >
                                  <Link href={item.url} legacyBehavior passHref>
                                    <NavigationMenuLink
                                      className={navigationMenuTriggerStyle()}
                                    >
                                      {item.name}
                                    </NavigationMenuLink>
                                  </Link>
                                </NavigationMenuItem>
                              ))}
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => signOut()}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "dark:text-black"
                    )}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <Link href="/register" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Register
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Login
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
              <ModeToggle />
              <PrimaryToggle />
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
