import type React from "react"
import { auth } from "../utils/auth"
import { redirect } from "next/navigation"
import SidebarLayout from "./dashboard/_components/sidebar-layout";
import { SessionProvider } from "next-auth/react";
import { onGetUserProfile } from "@/actions/auth";
import { User } from "lucide-react";
import Link from "next/link";
import { UserProfileHeader } from "./dashboard/_components/user-profile-header";
import { Button } from "@/components/ui/button";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  const candidate = await onGetUserProfile();
  console.log("Session form candidata layout: ", session)
  if (!session?.user) {
    redirect("/candidate/login")
  }
  return (
    <SessionProvider>
      <div className="flex bg-[#F0F0F0] p-4 relative min-h-screen">
        <SidebarLayout />
        <div className="flex-1 flex flex-col">
          <main className="pl-0 lg:pl-4 lg:pt-0 flex-1">
            <div className="max-w-7xl mx-auto py-2">
              <div className="flex items-center justify-between mb-2">
                <div className=""></div>
                <div className="flex items-center gap-[8px]">
                  <Button variant="outline" asChild className="flex items-center gap-3 bg-white pl-[7px] pr-4 py-5 rounded-full border border-gray-200">
                    <Link href="/account">
                      {session.user.image ? <img src={session.user.image} alt="logo" className="w-8 h-8 rounded-full border border-gray-200" /> : <User className="w-8 h-8" />}
                      <span className="text-[14px] font-medium">{session.user.name}</span>
                    </Link>
                  </Button>
                  <UserProfileHeader />
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
