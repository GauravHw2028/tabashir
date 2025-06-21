"use client"

import { useEffect, useState } from "react"
import { SearchPreferences } from "./_components/search-preferences"
import { JobListings } from "./_components/job-listings"
import { JobDetails } from "./_components/job-details"
import type { Job } from "./_components/types"
import { getJobs } from "@/lib/api"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { getAiJobApplyStatus } from "@/actions/ai-resume"
import { useSession } from "next-auth/react"
import { transformJobs } from "@/lib/transformJobs"

export default function JobsPage() {
  const session = useSession();
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [location, setLocation] = useState(searchParams.get("location") || "")
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "")
  const [salaryMin, setSalaryMin] = useState(searchParams.get("salaryMin") || "")
  const [salaryMax, setSalaryMax] = useState(searchParams.get("salaryMax") || "")
  const [experience, setExperience] = useState(searchParams.get("experience") || "")
  const [attendance, setAttendance] = useState(searchParams.get("attendance") || "")
  const [query, setQuery] = useState(searchParams.get("query") || "")
  const [jobApplyCount, setJobApplyCount] = useState(0)
  const [sort, setSort] = useState<"newest" | "oldest" | "salary_asc" | "salary_desc">(
    (searchParams.get("sort") as "newest" | "oldest" | "salary_asc" | "salary_desc") || "newest"
  )

  const fetchJobs = async () => {
    setLoading(true)
    const jobs = await getJobs(session.data?.user?.email || "", location, jobType, salaryMin, salaryMax, experience, attendance, query, sort)

    if (jobs.success) {
      // Transform the API data to match the frontend's Job type
      const transformedJobs = transformJobs(jobs.data)
      console.log(transformedJobs);

      setJobs(transformedJobs)
    } else {
      toast.error("Failed to fetch jobs!")
    }
    setLoading(false)
  }

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (jobType) params.set("jobType", jobType)
    if (salaryMin) params.set("salaryMin", salaryMin)
    if (salaryMax) params.set("salaryMax", salaryMax)
    if (experience) params.set("experience", experience)
    if (attendance) params.set("attendance", attendance)
    if (query) params.set("query", query)
    if (sort) params.set("sort", sort)

    router.push(`/jobs?${params.toString()}`)
  }

  // Handle filter changes
  const handleFilterChange = (
    type: "location" | "jobType" | "salaryMin" | "salaryMax" | "experience" | "attendance" | "query" | "sort",
    value: string
  ) => {
    switch (type) {
      case "location":
        setLocation(value)
        break
      case "jobType":
        setJobType(value)
        break
      case "salaryMin":
        setSalaryMin(value)
        break
      case "salaryMax":
        setSalaryMax(value)
        break
      case "experience":
        setExperience(value)
        break
      case "attendance":
        setAttendance(value)
        break
      case "query":
        setQuery(value)
        break
      case "sort":
        setSort(value as "newest" | "oldest" | "salary_asc" | "salary_desc")
        break
    }
  }

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs()
    updateURL()
  }, [location, jobType, salaryMin, salaryMax, experience, attendance, query, sort])

  useEffect(() => {
    (async () => {
      const jobs = await getAiJobApplyStatus();

      if (!jobs.error) {
        setJobApplyCount(jobs.data?.jobCount || 0)
      } else {
        toast.error("Failed to fetch jobs!")
      }
    })()
  }, [])

  return (
    <div className="h-screen flex flex-col lg:flex-row gap-6 rounded-lg max-h-[calc(100vh-35px)] relative">
      {/* {loading && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg z-50">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-700">Loading jobs...</p>
        </div>
      )} */}
      {/* First column: Search preferences (conditionally rendered) */}
      {showFilters && (
        <div className="fixed inset-0 lg:relative lg:inset-auto lg:w-[280px] bg-white rounded-lg shadow-sm p-6 overflow-y-auto flex-shrink-0 animate-in slide-in-from-left duration-300 z-40 lg:z-auto">
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              ✕
            </button>
          </div>
          <SearchPreferences
            location={location}
            jobType={jobType}
            salaryMin={salaryMin}
            salaryMax={salaryMax}
            experience={experience}
            attendance={attendance}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Second column: Job listings */}
      <div className={`flex-1 rounded-lg bg-white ${selectedJob ? 'hidden lg:block lg:flex-1' : ''}`}>
        <JobListings
          onSelectJob={setSelectedJob}
          jobs={jobs}
          selectedJobId={selectedJob?.id}
          setShowFilter={() => { setShowFilters(!showFilters) }}
          showFilters={showFilters}
          selectedJob={!!selectedJob}
          loading={loading}
          query={query}
          onQueryChange={(value) => handleFilterChange("query", value)}
          sort={sort}
          onSortChange={(value) => handleFilterChange("sort", value)}
        />
      </div>

      {/* Third column: Job details (conditionally rendered) */}
      {selectedJob && (
        <div className="fixed inset-0 lg:relative lg:inset-auto lg:w-[400px] bg-white rounded-lg shadow-sm overflow-y-auto flex-shrink-0 animate-in slide-in-from-right duration-300 z-50 lg:z-auto">
          <JobDetails
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            jobApplyCount={jobApplyCount}
            onJobApplied={() => {
              // Refresh the page after successful job application
              // window.location.reload()
            }}
            userId={session.data?.user?.id || ""}
          />
        </div>
      )}
    </div>
  )
}
