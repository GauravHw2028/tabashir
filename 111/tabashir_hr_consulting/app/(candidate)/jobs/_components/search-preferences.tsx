"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"

interface SearchPreferencesProps {
  location: string
  jobType: string
  salaryMin: string
  salaryMax: string
  experience: string
  attendance: string
  onFilterChange: (
    type: "location" | "jobType" | "salaryMin" | "salaryMax" | "experience" | "attendance" | "query" | "sort",
    value: string
  ) => void
}

const LOCATIONS = ["Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Ras Al Khaimah, UAE", "Fujairah, UAE", "Ajman, UAE", "Umm Al Quwain, UAE", "Al Ain, UAE"]
const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Freelance"]
const ATTENDANCE_TYPES = ["Hybrid", "Onsite", "Remote"]

export function SearchPreferences({
  location,
  jobType,
  salaryMin,
  salaryMax,
  experience,
  attendance,
  onFilterChange
}: SearchPreferencesProps) {
  // For the salary slider, keep local state for UI, but sync with parent on change
  const [salaryRange, setSalaryRange] = useState([
    Number(salaryMin) || 12000,
    Number(salaryMax) || 50000
  ])

  // Handle salary slider change
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>, idx: 0 | 1) => {
    const newRange = [...salaryRange] as [number, number]
    newRange[idx] = Number(e.target.value)
    setSalaryRange(newRange)
    onFilterChange(idx === 0 ? "salaryMin" : "salaryMax", e.target.value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold mb-1 flex items-center gap-2 text-gray-900">
          <Search size={18} />
          Search Preferences
        </h2>
        <p className="text-xs text-gray-500">Filter the jobs of your choice</p>
      </div>

      {/* Location */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">📍</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Location</label>
        </div>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none text-gray-700"
            value={location}
            onChange={e => onFilterChange("location", e.target.value)}
          >
            <option value="">Select location</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Job Type */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">💼</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Job Type</label>
        </div>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none text-gray-700"
            value={jobType}
            onChange={e => onFilterChange("jobType", e.target.value)}
          >
            <option value="">Select job type</option>
            {JOB_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">📈</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Experience Level</label>
        </div>
        <input
          type="text"
          placeholder="2 years"
          className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
          value={experience}
          onChange={e => onFilterChange("experience", e.target.value)}
        />
      </div>

      {/* Attendance */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">🏢</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Attendance</label>
        </div>
        <div className="flex gap-2">
          {ATTENDANCE_TYPES.map(type => (
            <button
              key={type}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${attendance === type ? "bg-blue-500 text-white border-blue-500" : "bg-gray-200 text-gray-700 border-gray-200"}`}
              onClick={e => {
                e.preventDefault();
                onFilterChange("attendance", attendance === type ? "" : type)
              }}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">💰</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Salary</label>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            AED {salaryRange[1].toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="range"
            min={100}
            max={50000}
            step={1000}
            value={salaryRange[0]}
            onChange={e => handleSalaryChange(e, 0)}
            className="w-full accent-blue-500"
          />
          <input
            type="range"
            min={100}
            max={50000}
            step={1000}
            value={salaryRange[1]}
            onChange={e => handleSalaryChange(e, 1)}
            className="w-full accent-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <div className="border border-gray-300 rounded-md px-2 py-1 text-sm w-[45%] text-gray-700 bg-white">
            AED {salaryRange[0].toLocaleString()}
          </div>
          <div className="border border-gray-300 rounded-md px-2 py-1 text-sm w-[45%] text-gray-700 bg-white">
            AED {salaryRange[1].toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
