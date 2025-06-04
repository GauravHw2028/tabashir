"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileText,
  User,
  HelpCircle,
  LogOut,
  CreditCard,
} from "lucide-react";
import { signOut } from "@/app/utils/auth";
import { onLogout } from "@/actions/auth";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Jobs",
      href: "/admin/jobs",
      icon: Briefcase,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
    },
  ];

  const profileItems = [
    {
      name: "Account",
      href: "/admin/account",
      icon: User,
    },
    {
      name: "Help Center",
      href: "/admin/help",
      icon: HelpCircle,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">TABASHIR</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 my-1 rounded-lg text-sm ${isActive
                    ? "blue-gradient text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-gray-500"
                    }`}
                />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-gray-200">
            {profileItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 my-1 rounded-lg text-sm ${isActive
                      ? "blue-gradient text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-gray-500"
                      }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg w-full"
            onClick={() => {
              onLogout("/admin/login");
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
