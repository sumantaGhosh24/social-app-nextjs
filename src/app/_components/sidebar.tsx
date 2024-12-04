import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {AppSidebar} from "./app-sidebar";

export default function SidebarLayout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
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
