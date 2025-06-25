"use client";

import { Filter, Search } from "lucide-react";
import type { Job } from "./types";
import JobCard from "@/components/job-card";


interface JobListingsProps {
  jobs: Job[]
  onSelectJob: (job: Job) => void
  selectedJobId?: string
  setShowFilter: () => void
  showFilters: boolean
  selectedJob: boolean
  loading: boolean
  query: string
  onQueryChange: (value: string) => void
  sort: "newest" | "oldest" | "salary_asc" | "salary_desc"
  onSortChange: (value: "newest" | "oldest" | "salary_asc" | "salary_desc") => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function JobListings({
  jobs,
  onSelectJob,
  selectedJobId,
  setShowFilter,
  showFilters,
  selectedJob,
  loading,
  query,
  onQueryChange,
  sort,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange
}: JobListingsProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
            <button
              onClick={setShowFilter}
              className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </span>
            </button>
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-end lg:justify-start">
            <select
              className="w-full sm:w-auto border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as "newest" | "oldest" | "salary_asc" | "salary_desc")}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary_asc">Salary: Low to High</option>
              <option value="salary_desc">Salary: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Skeleton loading state
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          // No jobs found state
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No jobs found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          // Job cards
          <div className="p-6 space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => onSelectJob(job)}
                isSelected={job.id === selectedJobId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t bg-white">
          <JobPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

// Job Pagination Component
interface JobPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function JobPagination({ currentPage, totalPages, onPageChange }: JobPaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {currentPage > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2 py-2 text-sm">...</span>}
            </>
          )}

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm rounded-md border ${page === currentPage
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2 py-2 text-sm">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 text-sm rounded-md border hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 text-sm rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// interface JobCardProps {
//   job: Job;
//   onClick: () => void;
//   isSelected: boolean;
// }

// function JobCard({ job, onClick, isSelected }: JobCardProps) {
//   return (
//     <div
//       className={`bg-white rounded-lg p-4 shadow-sm cursor-pointer transition-all   ${
//         isSelected ? "border-2 border-blue-500" : ""
//       }`}
//       onClick={onClick}
//     >
//       <div className="flex gap-4">
//         <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
//           <Image
//             src={job.logo || "/placeholder.svg"}
//             alt={job.company}
//             width={64}
//             height={64}
//             className="w-full h-full object-contain p-2"
//           />
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between">
//             <div>
//               <h3 className="font-medium text-gray-900">{job.title}</h3>
//               <p className="text-sm text-gray-600">{job.company}</p>
//             </div>

//             <div className="flex items-start gap-2">
//               {job.match && (
//                 <div
//                   className={`px-3 py-1 rounded-full text-xs text-white ${
//                     job.match.type === "top"
//                       ? "bg-orange-500"
//                       : job.match.type === "best"
//                       ? "bg-blue-500"
//                       : "bg-pink-500"
//                   }`}
//                 >
//                   {job.match.type === "top"
//                     ? "Top Match"
//                     : job.match.type === "best"
//                     ? "Best For You"
//                     : `${job.match.value}% Match`}
//                 </div>
//               )}

//               <button className="text-gray-400 hover:text-red-500">
//                 <Heart size={20} />
//               </button>
//             </div>
//           </div>

//           <div className="mt-2 flex items-center text-xs text-gray-500 gap-4">
//             <div className="flex items-center gap-1">
//               <MapPin size={14} />
//               <span>{job.location}</span>
//             </div>
//             <div>{job.views} views</div>
//             <div>{job.postedTime}</div>
//             <div>{job.jobType}</div>
//             <div>{job.applicationsCount} applied</div>
//           </div>

//           <div className="mt-2 flex justify-between items-center">
//             <div className="flex gap-2">
//               <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
//                 Team
//               </div>
//               <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
//                 {job.department}
//               </div>
//             </div>

//             <div className="text-sm font-medium text-blue-500">
//               {job.salary.amount.toLocaleString()} {job.salary.currency}
//               <span className="text-xs text-gray-500">
//                 /{job.salary.period}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
