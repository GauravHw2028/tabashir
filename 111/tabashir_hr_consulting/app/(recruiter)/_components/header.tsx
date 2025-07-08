"use client"

import { Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-5 px-6 flex items-center justify-between">
      <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center ml-auto">
        <div className="text-right mr-4">
          <p className="text-sm font-medium">Recruiter</p>
          <p className="text-xs text-gray-500">Recruiter Portal</p>
        </div>
        <Avatar>
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-headshot-MVQzBgqCWCm5OITNqIsbe1y1jZinpg.png"
            alt="Recruiter"
            className="object-cover h-full w-full rounded-full "
          />
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
} 