"use client";

import Image from "next/image";
import Link from "next/link";

import useFollow from "@/hooks/use-follow";
import {IUser} from "@/models/userModel";
import {Button} from "@/components/ui/button";

interface ProfileDetailsProps {
  user: IUser;
  currentUser: IUser;
}

const ProfileDetails = ({user, currentUser}: ProfileDetailsProps) => {
  const {isFollowing, toggleFollow} = useFollow({
    userId: user?._id,
    currentUser,
  });

  return (
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <h1 className="mb-5 text-3xl font-bold">Profile Details</h1>
        {user?.coverImage && (
          <Image
            src={user.coverImage.url}
            alt={user.coverImage.public_id}
            width={500}
            height={150}
            placeholder="blur"
            blurDataURL={user.coverImage.blurHash}
            priority
            className="w-full h-[350px] rounded"
          />
        )}
        {user?.profileImage && (
          <div className="relative">
            <Image
              src={user.profileImage.url}
              alt={user.profileImage.public_id}
              width={100}
              height={100}
              placeholder="blur"
              blurDataURL={user.profileImage.blurHash}
              priority
              className="h-[200px] w-[200px] rounded-full absolute -top-[150px] left-[50%] bg-white p-3"
              style={{transform: "translateX(-50%)"}}
            />
          </div>
        )}
        <br />
        <h2 className="text-2xl font-bold capitalize">{user.name}</h2>
        {currentUser?._id !== user?._id && (
          <Button
            onClick={toggleFollow}
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
        <div>
          <h3 className="text-lg font-bold">
            Followers:{" "}
            <span className="font-medium">{user?.followers?.length || 0}</span>
          </h3>
          <h3 className="text-lg font-bold">
            Followings:{" "}
            <span className="font-medium">{user?.followings?.length || 0}</span>
          </h3>
        </div>
        <h3 className="text-lg font-bold">
          Username: <span className="font-medium">{user.username}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Email address: <span className="font-medium">{user.email}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Mobile number:{" "}
          <span className="font-medium">{user.mobileNumber}</span>
        </h3>
        <h3 className="text-lg font-bold">
          DOB:{" "}
          <span className="font-medium">
            {new Date(user.dob).toLocaleDateString()}
          </span>
        </h3>
        <h3 className="text-lg font-bold">
          Gender: <span className="font-medium">{user.gender}</span>
        </h3>
        <h3 className="text-lg font-bold">
          City: <span className="font-medium">{user.city}</span>
        </h3>
        <h3 className="text-lg font-bold">
          State: <span className="font-medium">{user.state}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Country: <span className="font-medium">{user.country}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Zip: <span className="font-medium">{user.zip}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Addressline: <span className="font-medium">{user.addressline}</span>
        </h3>
        <h3 className="text-lg font-bold">
          Created at:{" "}
          <span className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </h3>
        {user.socialLinks.length > 0 && (
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-bold">Social Links: </h4>
            <div className="flex gap-3">
              {user.socialLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.link}
                  target="_blank"
                  className="text-sm font-medium text-blue-800 hover:underline capitalize"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
