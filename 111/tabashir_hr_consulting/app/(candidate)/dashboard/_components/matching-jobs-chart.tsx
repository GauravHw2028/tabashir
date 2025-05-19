"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Onsite", value: 372, color: "#FF6384" },
  { name: "Hybrid", value: 250, color: "#36A2EB" },
  { name: "Remote", value: 64, color: "#4BC0C0" },
  { name: "Flexible", value: 50, color: "#FFCE56" },
]

export function MatchingJobsChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-700">Total Matching Jobs</h2>
        <div className="text-2xl font-bold">{total}</div>
      </div>

      <div className="flex items-center">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ml-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="text-sm text-gray-600">{item.name}</div>
              </div>
              <div className="text-sm font-medium ml-auto">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
