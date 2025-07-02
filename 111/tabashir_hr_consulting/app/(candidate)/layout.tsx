import type React from "react"
import { auth } from "../utils/auth"
import { redirect } from "next/navigation"
import { onGetUserProfile } from "@/actions/auth";
import CandidateLayout from "./candidate-layout";

export default async function CandidateLayoutPage({
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
    <CandidateLayout session={session}>
      {children}
    </CandidateLayout>
  )
}
