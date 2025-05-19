import type React from "react";
import OwnerLayoutContent from "./layout-content";
import { auth } from "../utils/auth";
import { redirect } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("Session form candidata layout: ", session);
  if (!session?.user || session.user.userType !== "ADMIN") {
    redirect("/admin/login");
  }
  return (
    <div className="flex h-screen bg-[#F0F0F0] text-gray-900">
      <OwnerLayoutContent>{children}</OwnerLayoutContent>
    </div>
  );
}
