import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Eye } from "lucide-react"

interface AdminJobCardProps {
  id: string
  title: string
  type: string
  received: number
  interviewed: number
  views: string
  activeDate: string
  status: "active" | "paused" | "closed"
}

export default function AdminJobCard({ id, title, type, received, interviewed, views, activeDate, status }: AdminJobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "closed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="bg-[#0A2463] rounded-lg p-6 text-white h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-300">#{id}</p>
        </div>
        <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">{type}</span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm">Received</span>
          </div>
          <span className="text-sm">{received}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm">Interviewed</span>
          </div>
          <span className="text-sm">{interviewed}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm">Total Views</span>
          </div>
          <span className="text-sm">{views}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-sm">Active Since</span>
          </div>
          <span className="text-sm">{activeDate}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(status)} mr-2`}></span>
          <span className="text-sm">{getStatusText(status)}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/jobs/${id}/edit`}>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-blue-800">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </Link>
          <Link href={`/admin/jobs/${id}`}>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-blue-800">
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 