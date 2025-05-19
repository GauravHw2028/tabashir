"use client"

import { useState } from "react"
import StatCard from "../../_components/stat-card"
import ApplicationStatusChart from "../../_components/application-status-chart"
import SkillTrendsChart from "../../_components/skill-trends-chart"
import JobsTable from "../../_components/jobs-table"
import { Button } from "@/components/ui/button"

export default function OwnerDashboard() {
  const [selectedJob, setSelectedJob] = useState("Frontend Developer")
  const [selectedSkill, setSelectedSkill] = useState("UI/UX")

  // Sample data for the dashboard
  const statsData = [
    {
      title: "Jobs Active",
      value: "12",
      icon: "briefcase",
      color: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      title: "Applications Received",
      value: "57,000",
      icon: "grid",
      color: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      title: "Interview Schedule",
      value: "210",
      icon: "check",
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
  ]

  const applicationStatusData = [
    { name: "Received", value: 372, color: "#FF5A5A" },
    { name: "Shortlisted", value: 250, color: "#50C878" },
    { name: "Interviewed", value: 64, color: "#3B82F6" },
    { name: "Rejected", value: 50, color: "#FFA500" },
  ]

  const jobsData = [
    {
      title: "Frontend Developer",
      postedOn: "23-Mar-2025",
      type: "Full Time",
      applicants: 2534,
      status: "Open",
    },
    {
      title: "Web Design",
      postedOn: "20-March-2025",
      type: "Internship",
      applicants: 1200,
      status: "Closed",
    },
    {
      title: "UI/UX",
      postedOn: "19-March-2025",
      type: "Entry Level",
      applicants: 3421,
      status: "Paused",
    },
    {
      title: "Backend Developer",
      postedOn: "19-March-2025",
      type: "Full Time",
      applicants: 5540,
      status: "Open",
    },
    {
      title: "Backend Developer",
      postedOn: "19-March-2025",
      type: "Full Time",
      applicants: 5540,
      status: "Open",
    },
  ]

  return (
    <div className="p-6 text-gray-900">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts 
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 w-full md:w-[35%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Application Status</h2>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option>Frontend Developer</option>
              <option>Web Design</option>
              <option>UI/UX</option>
              <option>Backend Developer</option>
            </select>
          </div>
          <ApplicationStatusChart data={applicationStatusData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 w-full md:w-[65%]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skill Trends</h2>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option>UI/UX</option>
              <option>React</option>
              <option>Node.js</option>
              <option>Python</option>
            </select>
          </div>
          <SkillTrendsChart />
        </div>
      </div>
      */}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Jobs</h2>
          <Button className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:from-[#0D57E1] hover:to-[#042052] text-white">
            Create new job
          </Button>
        </div>
        <JobsTable jobs={jobsData} />
      </div>
    </div>
  )
}
