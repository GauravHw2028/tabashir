"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SkillTrendsChartProps {
  jobTitle: string
}

interface ApiResponse {
  success: boolean
  data: {
    month: string
    count: number
  }[]
}

interface ChartData {
  name: string
  value: number
}

const skills = ["UI/UX", "Frontend", "Backend", "Full Stack", "Mobile", "DevOps"]

export function SkillTrendsChart({ jobTitle }: SkillTrendsChartProps) {
  const [selectedSkill, setSelectedSkill] = useState("UI/UX")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatMonthName = (monthString: string): string => {
    const date = new Date(monthString + "-01")
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  const fetchData = async (keyword: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`https://backend.tabashir.ae/api/v1/resume/jobs/monthly-count?keyword=${encodeURIComponent(keyword)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const apiData: ApiResponse = await response.json()

      if (apiData.success && apiData.data) {
        const transformedData: ChartData[] = apiData.data.map(item => ({
          name: formatMonthName(item.month),
          value: item.count
        }))
        setChartData(transformedData)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching skill trends data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (jobTitle) {
      fetchData(jobTitle)
    }
  }, [jobTitle])

  useEffect(() => {
    if (selectedSkill) {
      fetchData(selectedSkill)
    }
  }, [selectedSkill])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Skill Trends</h2>
        <div className="relative">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm cursor-pointer bg-white appearance-none pr-8"
          >
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax']}
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
        )}
      </div>
    </div>
  )
}
