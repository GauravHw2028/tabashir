import Image from "next/image"

interface MatchedJobCard {
  title: string
  company: string
  location: string
  salary: string
  gradient: string
  shadow: string
  logoUrl?: string
  tags?: string[]
  onApply?: () => void
}

export function MatchedJobCard({
  title,
  company,
  location,
  salary,
  gradient,
  shadow,
  logoUrl,
  tags = ["Onsite", "Internship"],
  onApply,
}: MatchedJobCard) {
  return (
    <div
      className="rounded-[29.63px] p-4 text-white flex flex-col justify-between h-[155px]"
      style={{
        background: gradient,
        boxShadow: shadow,
      }}
    >
      <div className="flex items-start justify-between">
        {/* <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
          {logoUrl ? (
            <Image src={logoUrl || "/placeholder.svg"} alt={company} width={24} height={24} />
          ) : (
            <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
              <span className="text-xs text-gray-500">@</span>
            </div>
          )}
        </div> */}
        <div className="space-y-[6px]">
          <h3 className="font-medium text-md leading-none">{title}</h3>
          <div className="text-xs opacity-80">{company}</div>
        </div>

      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1 mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={onApply}
          className="text-[11px] font-semibold bg-white py-[5px] leading-none px-[12px] text-[#5C5C5C] rounded-full text-center cursor-pointer transition-colors"
        >
          Apply
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xs">{salary}</div>

        <div className="text-[10px] mt-1">{location}</div>
      </div>

    </div>
  )
}
