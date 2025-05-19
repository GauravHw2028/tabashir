interface CountryDemand {
  country: string
  flag: string
  count: string
}

const countries: CountryDemand[] = [
  { country: "UAE", flag: "🇦🇪", count: "500+" },
  { country: "Canada", flag: "🇨🇦", count: "200+" },
  { country: "Saudia", flag: "🇸🇦", count: "135+" },
  { country: "Australia", flag: "🇦🇺", count: "50+" },
]

export function GlobalDemandList() {
  return (
    <div>
      <h2 className="text-xl font-medium text-gray-800 mb-6">Global Demand for UI/UX</h2>

      <div className="space-y-4">
        {countries.map((item) => (
          <div key={item.country} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.flag}</span>
              <span className="text-sm">{item.country}</span>
            </div>
            <div className="text-sm font-medium">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
