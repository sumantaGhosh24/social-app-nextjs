"use client";

import {useRouter} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";

import useFollow from "@/hooks/use-follow";
import {IUser} from "@/models/userModel";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

interface ProfileCardProps {
  user: IUser;
  currentUser: IUser;
}

const ProfileCard = ({user, currentUser}: ProfileCardProps) => {
  const router = useRouter();

  const {isFollowing, toggleFollow} = useFollow({
    userId: user._id,
    currentUser,
  });

  const handleClick = () => {
    router.push(`/profile/${user._id}`);
  };

  return (
    <Card className="flex items-center w-[80%] justify-between">
      <CardHeader className="flex items-center flex-row gap-2.5">
        <Avatar>
          <AvatarImage src={user.profileImage.url} />
          <AvatarFallback className="uppercase font-extrabold">
            {user.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="mb-1 capitalize">{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <div>
        <p>Followers: {user?.followers?.length || 0}</p>
        <p>Followings: {user?.followings?.length || 0}</p>
      </div>
      <div>
        <p>Age: {formatDistanceToNowStrict(user.dob)}</p>
        <p>User Since: {formatDistanceToNowStrict(user.createdAt)}</p>
      </div>
      <CardFooter className="flex gap-3">
        <Button onClick={() => handleClick()}>View</Button>
        {user._id !== currentUser._id && (
          <Button
            onClick={toggleFollow}
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
