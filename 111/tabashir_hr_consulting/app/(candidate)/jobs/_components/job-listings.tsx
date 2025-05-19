"use client";

import { useState } from "react";
import { Heart, MapPin, ChevronDown, Sparkles, Filter } from "lucide-react";
import type { Job } from "./types";
import { mockJobs } from "./mock-data";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserProfileHeader } from "../../dashboard/_components/user-profile-header";
import JobCard from "@/components/job-card";

interface JobListingsProps {
  onSelectJob: (job: Job) => void;
  selectedJobId?: string;
  showFilters: boolean;
  setShowFilter: () => void;
  selectedJob:boolean
}

export function JobListings({
  onSelectJob,
  selectedJobId,
  showFilters,
  setShowFilter,
  selectedJob
}: JobListingsProps) {
  const [jobs] = useState<Job[]>(mockJobs);

  return (
    <div className="space-y-4 px-4 pt-6 pb-6 rounded-md   ">
      {/* Search bar at the top */}
      <div className="flex justify-between items-center ">
        <div className="max-w-[70%] w-[70%]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Category, Company or ..."
              className="pl-4 pr-10 py-3 border border-gray-300 rounded-full w-full text-sm text-gray-700"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-[#002B6B] text-white rounded-r-full px-4">
              <Search size={18} />
            </button>
          </div>
        </div>
        {!(showFilters && selectedJob) && <UserProfileHeader />}
      </div>

      <div className="flex justify-between items-center sticky top-0  py-2 z-10 bg-white">
        <div className="flex items-center justify-center gap-2">
          <div className=" flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={setShowFilter}
                className={cn(
                  "flex items-center  bg-transparent border border-gray-300 rounded-lg pr-8 text-sm text-gray-700  gap-2 px-4 py-2  font-medium",
                  showFilters &&
                    " bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white"
                )}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {/* Sort controls would go here */}
            </div>
          </div>

          <div className="text-sm text-gray-700">Sort</div>
          <div className="relative">
            <select className="px-4 py-2 appearance-none bg-transparent border border-gray-300 rounded-lg pr-8 text-sm text-gray-700">
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Salary</option>
              <option>Lowest Salary</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={14}
            />
          </div>
        </div>

        {/* AI Recommendation button with golden sparkle and blue gradient */}
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="text-yellow-300" size={16} />
          <span>AI Recommendation</span>
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onSelectJob(job)}
            isSelected={job.id === selectedJobId}
          />
        ))}
      </div>
    </div>
  );
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

function Search(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
