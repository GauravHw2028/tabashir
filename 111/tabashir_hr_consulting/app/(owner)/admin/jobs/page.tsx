"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import JobCard from "../../_components/job-card"
import CreateJobCard from "../../_components/create-job-card"
import { getJobs } from "./actions"
import Loading from "./loading"

export default function JobsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [jobs, setJobs] = useState<any[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getJobs(currentPage, itemsPerPage)
        setJobs(result.jobs)
        setTotalJobs(result.total)
        setTotalPages(result.totalPages)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage, itemsPerPage])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="p-6 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <Link href="/admin/jobs/new">
          <Button className="bg-gradient-to-r from-[#042052] to-[#0D57E1]">
            <Plus className="mr-2 h-4 w-4" /> Create New Job
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Sort dropdown */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sort</span>
            <Select defaultValue="latest">
              <SelectTrigger className="w-[180px] border border-gray-200">
                <SelectValue placeholder="Latest Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Posted</SelectItem>
                <SelectItem value="oldest">Oldest Posted</SelectItem>
                <SelectItem value="most-applications">Most Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <CreateJobCard />

          {jobs.map((job) => (
            <Link key={job.id} href={`/admin/jobs/${job.id}`}>
              <JobCard
                id={job.id}
                title={job.title}
                type={job.jobType}
                received={job.applicationsCount}
                interviewed={0}
                views={job.views.toString()}
                activeDate={new Date(job.createdAt).toLocaleDateString()}
                status={job.isActive ? "active" : "paused"}
              />
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span>Showing</span>
            <Select 
              defaultValue="10"
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1) // Reset to first page when changing items per page
              }}
            >
              <SelectTrigger className="w-[60px] mx-2 h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <span>of {totalJobs}</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-md ${
                  currentPage === index + 1 ? "bg-blue-950 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
