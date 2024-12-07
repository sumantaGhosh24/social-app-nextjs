import getServerUser from "@/actions/getServerUser";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import ProfileSidebar from "./_components/profile-sidebar";

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {id: string};
}>) {
  const {id: profileId} = await params;
  const user = await getServerUser();

  if (!profileId || !user) return null;

  return (
    <SidebarProvider>
      <ProfileSidebar profileId={profileId} userId={user._id} />
      <main className="w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent>
              <p>Shortcut: Ctrl + B</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {children}
      </main>
    </SidebarProvider>
  );
}
