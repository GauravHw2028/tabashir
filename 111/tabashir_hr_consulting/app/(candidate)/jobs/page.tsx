"use client"

import { useState } from "react"
import { SearchPreferences } from "./_components/search-preferences"
import { JobListings } from "./_components/job-listings"
import { JobDetails } from "./_components/job-details"
import { Filter } from "lucide-react"
import type { Job } from "./_components/types"

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="h-screen flex gap-6 rounded-lg max-h-[calc(100vh-35px)] ">
      {/* First column: Search preferences (conditionally rendered) */}
      {showFilters && (
        <div className="w-[280px] bg-white rounded-lg shadow-sm p-6 overflow-y-auto flex-shrink-0 animate-in slide-in-from-left duration-300">
          <SearchPreferences />
        </div>
      )}

      {/* Second column: Job listings */}
      <div className="flex-1 overflow-y-scroll rounded-lg  bg-white  ">


        <JobListings
          onSelectJob={setSelectedJob}
          selectedJobId={selectedJob?.id}
          setShowFilter={() =>{setShowFilters(!showFilters)}}
          showFilters={showFilters} // Add this prop to JobListings
          selectedJob={!!selectedJob}
        />
      </div>

      {/* Third column: Job details (conditionally rendered) */}
      {selectedJob && (
        <div className="w-[400px] bg-white rounded-lg shadow-sm overflow-y-auto flex-shrink-0 animate-in slide-in-from-right duration-300">
          <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
        </div>
      )}
    </div>
  )
}
