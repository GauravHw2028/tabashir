"use client"

import { useState, useEffect } from "react"

interface GlobalDemandListProps {
  jobTitle: string
  skills: string[]
}

interface ApiResponse {
  success: boolean
  data: {
    vacancy_city: string
    count: number
  }[]
}

interface CountryDemand {
  country: string
  flag: string
  count: number
}

const getCityMapping = (city: string): { country: string; flag: string } => {
  const cityLower = city.toLowerCase()

  if (cityLower.includes('dubai') || cityLower.includes('uae') || cityLower.includes('abu dhabi') ||
    cityLower.includes('sharjah') || cityLower.includes('emirates')) {
    return { country: "UAE", flag: "🇦🇪" }
  }
  if (cityLower.includes('taipei') || cityLower.includes('taiwan')) {
    return { country: "Taiwan", flag: "🇹🇼" }
  }
  if (cityLower.includes('bangalore') || cityLower.includes('india')) {
    return { country: "India", flag: "🇮🇳" }
  }
  if (cityLower.includes('المدينة المنورة') || cityLower.includes('saudi')) {
    return { country: "Saudi Arabia", flag: "🇸🇦" }
  }
  if (cityLower.includes('remote') || cityLower.includes('wfh')) {
    return { country: "Remote", flag: "🌐" }
  }

  // Default for unknown/unspecified locations
  return { country: "Other", flag: "🌍" }
}

export function GlobalDemandList({ jobTitle, skills }: GlobalDemandListProps) {
  const [countries, setCountries] = useState<CountryDemand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState(skills[0])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`https://backend.tabashir.ae/api/v1/resume/jobs/count-by-city?job_title=${encodeURIComponent(selectedSkill)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const apiData: ApiResponse = await response.json()

      if (apiData.success && apiData.data) {
        // Group cities by country and sum counts
        const countryMap = new Map<string, { country: string; flag: string; count: number }>()

        apiData.data.forEach(item => {
          // Skip empty/unknown entries
          if (!item.vacancy_city ||
            item.vacancy_city.toLowerCase().includes('unknown') ||
            item.vacancy_city.toLowerCase().includes('empty string') ||
            item.vacancy_city.toLowerCase().includes('not specified')) {
            return
          }

          const { country, flag } = getCityMapping(item.vacancy_city)

          if (countryMap.has(country)) {
            countryMap.get(country)!.count += item.count
          } else {
            countryMap.set(country, { country, flag, count: item.count })
          }
        })

        // Convert to array and sort by count (descending)
        const transformedData = Array.from(countryMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 6) // Show top 6 countries

        setCountries(transformedData)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching global demand data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSkill) {
      fetchData()
    }
  }, [selectedSkill])

  return (
    <div>
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        Global Demand for
        <select name="" id="" className="border rounded-md px-3 py-1.5 text-sm cursor-pointer bg-white appearance-none pr-8 ml-3" onChange={(e) => setSelectedSkill(e.target.value)}>
          {skills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </h2>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">Error: {error}</div>
          </div>
        ) : countries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">No data available</div>
          </div>
        ) : (
          countries.map((item) => (
            <div key={item.country} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.flag}</span>
                <span className="text-sm">{item.country}</span>
              </div>
              <div className="text-sm font-medium">{item.count}+</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
