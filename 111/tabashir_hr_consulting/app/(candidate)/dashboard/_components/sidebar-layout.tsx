"use client";


import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export default function SidebarLayout() {
  const pathname = usePathname();


  if (pathname.startsWith("/resume/new")) return null;

  return (
    <div className="sticky top-0 h-[calc(100vh-35px)]">
      <Sidebar />
    </div>
  );
}
