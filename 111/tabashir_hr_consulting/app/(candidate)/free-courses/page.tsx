"use client"

import { Search } from "lucide-react"
import Image from "next/image"

export default function FreeCourses() {
  // Course data
  const courses = [
    {
      id: 1,
      title: "VUE JAVASCRIPT COURSE",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/vue-javascript-course-banner.png",
      color: "#F39C12",
      tags: ["BEST SELLER"],
      category: "vue",
    },
    {
      id: 2,
      title: "UI DESIGN FOR BEGINNERS",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/ui-design-beginners-banner.png",
      color: "#E74C3C",
      tags: ["NEW"],
      category: "ui",
    },
    {
      id: 3,
      title: "MOBILE DEV REACT NATIVE",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/mobile-dev-react-native-banner.png",
      color: "#2ECC71",
      tags: ["BEST SELLER", "NEW"],
      category: "mobile",
    },
    {
      id: 4,
      title: "VUE JAVASCRIPT COURSE",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/vue-javascript-course-banner.png",
      color: "#F39C12",
      tags: [],
      category: "vue",
    },
    {
      id: 5,
      title: "UI DESIGN FOR BEGINNERS",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/ui-design-beginners-banner.png",
      color: "#E74C3C",
      tags: [],
      category: "ui",
    },
    {
      id: 6,
      title: "MOBILE DEV REACT NATIVE",
      subtitle: "VUE JS SCRATCH COURSE",
      studio: "Kleon Studio",
      description: "More than 8yr Experience as Illustrator. Learn how to becoming professional Illustrator now...",
      bannerImage: "/mobile-dev-react-native-banner.png",
      color: "#2ECC71",
      tags: ["BEST SELLER", "NEW"],
      category: "mobile",
    },
  ]

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative w-[370px]">
          <input
            type="text"
            placeholder="Search in videos"
            className="w-full h-10 pl-10 pr-4 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Recommended Videos section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1 text-black ">Recommended Videos</h2>
        <p className="text-sm text-gray-500">Top picks for you</p>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-[180px] overflow-hidden">
              <Image
                src={course.bannerImage || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
              {/* Play button - positioned at bottom right with spacing */}
              <div className="absolute z-50 bottom-4 right-4">
                <div className="bg-white bg-opacity-80 rounded-full p-2 cursor-pointer hover:bg-opacity-100 transition-all">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-gray-800 border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="flex gap-1">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tag === "BEST SELLER" ? "bg-blue-600 text-white" : "bg-pink-500 text-white"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className=" p-4">
              <h4 className="font-bold text-sm mb-1 text-black">{course.subtitle}</h4>
              <p className="text-xs text-gray-500 mb-2">&amp; {course.studio}</p>
              <p className="text-xs text-gray-700">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
