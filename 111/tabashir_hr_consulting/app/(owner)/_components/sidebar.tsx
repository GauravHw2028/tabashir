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
  Users,
  Mail,
  UserCog,
} from "lucide-react";
import { signOut } from "@/app/utils/auth";
import { onLogout } from "@/actions/auth";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import { AdminPermission } from "@prisma/client";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { canAccess, isLoading } = useAdminPermissions();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      permission: AdminPermission.MANAGE_DASHBOARD,
    },
    {
      name: "Jobs",
      href: "/admin/jobs",
      icon: Briefcase,
      permission: AdminPermission.MANAGE_JOBS,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      permission: AdminPermission.MANAGE_USERS,
    },
    {
      name: "AI Resumes",
      href: "/admin/aicv",
      icon: FileText,
      permission: AdminPermission.MANAGE_AI_CV,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: Mail,
      permission: AdminPermission.MANAGE_APPLICATIONS,
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      permission: AdminPermission.MANAGE_PAYMENTS,
    },
    {
      name: "Manage Admins",
      href: "/admin/manage-admins",
      icon: UserCog,
      permission: AdminPermission.MANAGE_ADMIN_PERMISSIONS,
    },
  ];

  // Filter navigation items based on permissions
  const accessibleNavItems = navItems.filter(item => canAccess(item.permission));

  const profileItems = [
    {
      name: "Account",
      href: "/admin/account",
      icon: User,
      permission: AdminPermission.MANAGE_ACCOUNT,
    },
    {
      name: "Help Center",
      href: "/admin/help",
      icon: HelpCircle,
      permission: AdminPermission.MANAGE_HELP,
    },
  ];

  // Filter profile items based on permissions
  const accessibleProfileItems = profileItems.filter(item => canAccess(item.permission));

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-64 sticky top-0 inset-y-0 left-0 z-50 transform h-screen ${open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">TABASHIR</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {!isLoading && accessibleNavItems.map((item) => {
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

          {!isLoading && accessibleProfileItems.length > 0 && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              {accessibleProfileItems.map((item) => {
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
          )}
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
