import type React from "react"
import { Sidebar } from "./dashboard/_components/sidebar"
import { UserProfileHeader } from "./dashboard/_components/user-profile-header"
import { auth } from "../utils/auth"
import { redirect } from "next/navigation"

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  console.log("Session form candidata layout: ", session)
 if(!session?.user){
  redirect("/candidate/login")
 }
  return (
    <div className="flex  bg-[#F0F0F0] p-4 relative">
      <div className="sticky top-0 h-[calc(100vh-35px)]">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col  h-[calc(100vh-35px)] ">
        <main className="pl-4  flex-1  ">{children}</main>
      </div>
    </div>
  )
}
