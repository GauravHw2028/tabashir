import type React from "react"
import { auth } from "../utils/auth"
import { redirect } from "next/navigation"
import SidebarLayout from "./dashboard/_components/sidebar-layout";
import { SessionProvider } from "next-auth/react";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  console.log("Session form candidata layout: ", session)
  if (!session?.user) {
    redirect("/candidate/login")
  }
  return (
    <SessionProvider>
      <div className="flex bg-[#F0F0F0] p-4 relative">
        <SidebarLayout />
        <div className="flex-1 flex flex-col">
          <main className="pl-4 lg:pl-4 lg:pt-0 flex-1">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
