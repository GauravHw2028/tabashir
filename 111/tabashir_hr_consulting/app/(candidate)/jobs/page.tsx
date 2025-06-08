"use client"

import { useEffect, useState } from "react"
import { SearchPreferences } from "./_components/search-preferences"
import { JobListings } from "./_components/job-listings"
import { JobDetails } from "./_components/job-details"
import { Filter } from "lucide-react"
import type { Job } from "./_components/types"
import { getJobs } from "@/lib/api"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { getAiJobApplyStatus } from "@/actions/ai-resume"
import { useSession } from "next-auth/react"

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
    const jobs = await getJobs(location, jobType, salaryMin, salaryMax, experience, attendance, query, sort)

    console.log(jobs)

    if (jobs.success) {
      // Transform the API data to match the frontend's Job type
      const transformedJobs = jobs.data.map((job: any) => ({
        id: job.id.toString(),
        title: job.job_title,
        company: job.entity,
        logo: job.logo,
        location: job.vacancy_city,
        postedTime: new Date(job.job_date).toLocaleDateString(),
        jobType: job.working_days,
        salary: {
          amount: job.salary,
          currency: "AED",
          period: "month"
        },
        description: job.job_description,
        requirements: job.academic_qualification,
        department: job.job_title,
        team: job.entity,
        match: {
          type: "percentage",
          value: 85 // Default match percentage
        },
      }))
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

  // Show purchase message if jobApplyCount is 0
  if (jobApplyCount === 0 && !loading) {
    return (
      <div className="h-screen flex items-center justify-center rounded-lg max-h-[calc(100vh-35px)]">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Premium Jobs</h2>
            <p className="text-gray-600 mb-6">
              You have no AI job applications remaining. Purchase a package to access job listings and apply with AI assistance.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Purchase AI Job Apply Package
            </button>
          </div>
        </div>
      </div>
    )
  }

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
      <div className={`flex-1 overflow-y-scroll rounded-lg bg-white ${selectedJob ? 'hidden lg:block lg:flex-1' : ''}`}>
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
