"use client";
import { onGetUserProfile } from "@/actions/auth";
import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

export function UserProfileHeader() {
  const [isLoading, setIsloading] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    userType: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      setIsloading(true);
      try {
        const data = await onGetUserProfile();
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    }
    fetchUserProfile();
  }, []);

  console.log("Profile: ", user);
  if (isLoading && !user) {
    return (
      <Card className="py-3 px-6 flex justify-end items-center rounded-md z-50 [&] !text-white">
        <div className="flex items-center gap-3">
          <div className="text-right text-black">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="py-3 px-6 flex justify-end items-center rounded-md z-50 [&] !text-white">
      <div className="flex items-center gap-3">
        <div className="text-right text-black">
          <p className="font-medium text-sm">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.userType}</p>
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={user?.profilePicture || "/placeholder-user.jpg"}
            alt="Profile"
            width={40}
            height={40}
            className="object-cover rounded-full w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
