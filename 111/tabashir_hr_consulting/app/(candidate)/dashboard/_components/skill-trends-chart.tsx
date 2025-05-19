"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4000 },
  { name: "May", value: 6000 },
  { name: "June", value: 5000 },
  { name: "July", value: 4000 },
  { name: "Aug", value: 5000 },
  { name: "Sep", value: 7000 },
  { name: "Oct", value: 6000 },
  { name: "Nov", value: 8000 },
  { name: "Dec", value: 7000 },
]

const skills = ["UI/UX", "Frontend", "Backend", "Full Stack", "Mobile", "DevOps"]

export function SkillTrendsChart() {
  const [selectedSkill, setSelectedSkill] = useState("UI/UX")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Skill Trends</h2>
        <div className="relative">
          <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm cursor-pointer bg-white">
            <span>{selectedSkill}</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 8000]}
              ticks={[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4285F4"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4285F4" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
