import Link from "next/link";
import {
  User,
  Settings,
  Lock,
  UserPlus,
  UserCog,
  Image,
  Save,
  Heart,
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
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
              {profileId === userId && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/private`}>
                        <Lock />
                        <span>Private Posts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/liked`}>
                        <Heart />
                        <span>Liked Posts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href={`/profile/${profileId}/saved`}>
                        <Save />
                        <span>Saved Posts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
