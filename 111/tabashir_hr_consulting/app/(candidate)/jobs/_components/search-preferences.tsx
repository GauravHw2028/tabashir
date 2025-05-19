"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"

export function SearchPreferences() {
  const [salaryRange, setSalaryRange] = useState([12000, 50000])

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
          <select className="w-full p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none text-gray-700">
            <option>Dubai, UAE</option>
            <option>Abu Dhabi, UAE</option>
            <option>Sharjah, UAE</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
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
          <select className="w-full p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none text-gray-700">
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Freelance</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
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
        />
      </div>

      {/* Tools/Skills */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">🛠️</span>
          </div>
          <label className="text-sm font-medium text-gray-700">Tools/Skills</label>
        </div>
        <div className="relative">
          <select className="w-full p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none text-gray-700">
            <option>i.e. Figma, Mango DB</option>
            <option>Figma</option>
            <option>Adobe XD</option>
            <option>Sketch</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
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
          <button className="px-3 py-1 text-xs rounded-full bg-blue-500 text-white">Hybrid</button>
          <button className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Onsite</button>
          <button className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Remote</button>
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
        <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full w-fit mb-2">$50,000</div>
        <div className="relative h-2 bg-blue-100 rounded-full mb-4">
          <div className="absolute left-0 right-0 h-full">
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
            <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
            <div className="absolute left-[20%] right-[40%] h-full bg-blue-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="border border-gray-300 rounded-md px-2 py-1 text-sm w-[45%] text-gray-700">AED 12,000</div>
          <div className="border border-gray-300 rounded-md px-2 py-1 text-sm w-[45%] text-gray-700">AED 50,000</div>
        </div>
      </div>

      <button className="w-full py-3 bg-[#002B6B] text-white rounded-md font-medium">Search Jobs</button>
    </div>
  )
}
