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
    <div className="container mx-auto my-10 space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
      <div className="overflow-hidden">
        <div className="relative h-[280px] w-full -z-50">
          {user?.coverImage && (
            <Image
              src={user.coverImage.url}
              alt="cover"
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={user.coverImage.blurHash}
              priority
            />
          )}
        </div>
        <div className="px-6 pb-6">
          {user?.profileImage && (
            <div className="flex justify-center -mt-20 z-50">
              <Image
                src={user.profileImage.url}
                alt="profile"
                width={160}
                height={160}
                className="rounded-full border-4 border-white dark:border-gray-900 object-cover"
                placeholder="blur"
                blurDataURL={user.profileImage.blurHash}
                priority
              />
            </div>
          )}
          <div className="text-center mt-4 space-y-3">
            <h2 className="text-3xl font-bold capitalize">{user.name}</h2>
            <p className="text-gray-500">@{user.username}</p>
            {currentUser?._id !== user?._id && (
              <Button
                onClick={toggleFollow}
                variant={isFollowing ? "secondary" : "default"}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <div className="flex justify-center gap-10 mt-6 text-center">
            <div>
              <p className="text-xl font-bold">
                {user?.followers?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>

            <div>
              <p className="text-xl font-bold">
                {user?.followings?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-10 text-sm">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                {user.mobileNumber}
              </p>
              <p>
                <span className="font-semibold">DOB:</span>{" "}
                {new Date(user.dob).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Gender:</span> {user.gender}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">City:</span> {user.city}
              </p>
              <p>
                <span className="font-semibold">State:</span> {user.state}
              </p>
              <p>
                <span className="font-semibold">Country:</span> {user.country}
              </p>
              <p>
                <span className="font-semibold">Zip:</span> {user.zip}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-semibold">Address</p>
            <p className="text-gray-500">{user.addressline}</p>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
          {user.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {user.socialLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.link}
                  target="_blank"
                  className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-200"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
