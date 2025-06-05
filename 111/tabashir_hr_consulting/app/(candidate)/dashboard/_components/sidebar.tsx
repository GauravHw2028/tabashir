"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  Heart,
  FileText,
  Sparkles,
  Video,
  DollarSign,
  Info,
  MessageCircle,
  BookOpen,
  User,
  LogOut,
} from "lucide-react"
import { onLogout } from "@/actions/auth"
import Image from "next/image"

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    { icon: ClipboardList, label: "Applied Jobs", href: "/applied-jobs" },
    { icon: Heart, label: "Liked Jobs", href: "/liked-jobs" },
    { icon: FileText, label: "Resume", href: "/resume" },
    { icon: Sparkles, label: "AI Job Apply", href: "/ai-job-apply" },
    { icon: Video, label: "Interview Training", href: "/interview-training" },
    { icon: Info, label: "Service Details", href: "/service-details" },
    { icon: MessageCircle, label: "Whatsapp Community", href: "/whatsapp-community" },
    { icon: BookOpen, label: "Free Courses", href: "/free-courses" },
  ]

  return (
    <div className="h-full w-full lg:w-[250px] bg-white border-r flex flex-col rounded-lg p-3">
      <div className="px-3 pb-4 pt-5 border-b mb-3 max-lg:hidden">
        <Image src="/logo.png" alt="logo" width={217} height={32} className="mx-auto" />
      </div>

      <div className="flex-1 overflow-auto py-4 max-lg:py-1">
        <nav className=" px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavigation}
              className={`flex items-center px-2 py-2 mb-2 text-base font-medium rounded-md ${isActive(item.href) ? "blue-gradient text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <Link
          href="/account"
          onClick={handleNavigation}
          className="flex items-center px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
        >
          <User className="mr-3 h-5 w-5" />
          Account
        </Link>
        <button onClick={() => {
          onLogout("/candidate/login")
        }} className="flex items-center px-2 py-2 mt-2 text-sm rounded-md text-red-500 hover:bg-gray-100 w-full text-left">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
