import { Briefcase, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AppliedJobsCardProps {
  count: number
}

export function AppliedJobsCard({ count }: AppliedJobsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
          <Briefcase className="text-amber-500" size={20} />
        </div>
        <div>
          <h3 className="text-2xl font-bold">{count}</h3>
          <p className="text-gray-500 text-sm">Jobs Applied</p>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-4"></div>

      <Link
        href="/applied-jobs"
        className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
      >
        <span>View Details</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
