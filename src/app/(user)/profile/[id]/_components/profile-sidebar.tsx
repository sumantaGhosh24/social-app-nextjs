import Link from "next/link";
import {
  User,
  Settings,
  Lock,
  UserPlus,
  UserCog,
  Image,
  Video,
  Music,
  MessageCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface ProfileSidebarProps {
  profileId: string;
  userId: string;
}

export default function ProfileSidebar({
  profileId,
  userId,
}: ProfileSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}`}>
                    <User />
                    <span>Details</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {profileId === userId && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/update`}>
                        <Settings />
                        <span>Update Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/image`}>
                        <Image />
                        <span>Update Image</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/password`}>
                        <Lock />
                        <span>Reset Password</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Connection</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}/followers`}>
                    <UserPlus />
                    <span>Followers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}/followings`}>
                    <UserCog />
                    <span>Followings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {profileId === userId && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/comments`}>
                        <MessageCircle />
                        <span>My Comments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/* my/private/saved/liked */}
        <SidebarGroup>
          <SidebarGroupLabel>Media</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}/posts`}>
                    <Image />
                    <span>Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}/videos`}>
                    <Video />
                    <span>Videos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/profile/${profileId}/audios`}>
                    <Music />
                    <span>Audios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
