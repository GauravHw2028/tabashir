"use client"

import { useTranslation } from "@/lib/use-translation";
import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { UserProfileHeader } from "./dashboard/_components/user-profile-header";
import SidebarLayout from "./dashboard/_components/sidebar-layout";
import { usePathname } from "next/navigation";

export default function CandidateLayout({
  children,
  session,
}: {
  children: React.ReactNode,
  session: any
}) {
  const pathname = usePathname();
  const { isRTL } = useTranslation();
  return (
    <SessionProvider>
      <div className={`flex ${isRTL ? 'flex-row-reverse gap-10' : 'flex-row gap-4'} bg-[#F0F0F0] p-4 relative min-h-screen`}>
        <SidebarLayout />
        <div className="flex-1 flex flex-col">
          <main className="pl-0 lg:pl-4 lg:pt-0 flex-1">
            <div className={`max-w-7xl mx-auto py-2 ${pathname.startsWith("/resume") ? 'mb-6' : ''}`}>
              <div className={`flex items-center mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${pathname.startsWith("/resume") ? 'max-md:flex-col justify-between' : 'justify-end'}`}>
                {pathname.startsWith("/resume") && <h1 className="text-4xl font-bold text-gray-900 mb-6">TABASHIR</h1>}
                <div className="flex items-center gap-[8px]">
                  <Button variant="outline" asChild className="flex items-center gap-3 bg-white pl-[7px] pr-4 py-5 rounded-full border text-gray-900 border-gray-200">
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