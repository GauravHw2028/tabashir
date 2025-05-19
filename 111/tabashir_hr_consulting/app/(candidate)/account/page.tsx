"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function AccountPage() {
  const [skills, setSkills] = useState(["Figma", "Adobe Cloud", "Team Work", "Time Management"])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div className="flex-1 p-6 text-gray-900 max-h-[calc(100vh-35px)] rounded-lg overflow-y-scroll">
      <div className=" space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Personal Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto" >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Username</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">Zawar Ahmed Farooqi</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Gender</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">Male</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Profile Picture</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">Profile Picture</span>
                    <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Account Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Email</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">balamini@gmail.com</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Password</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">••••••••••••••</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Phone</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">+1 345 234566</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Professional Information</h2>
          </CardHeader>
          <CardContent className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Title</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">Software Engineer</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-start">
                <label className="text-gray-700 pt-2">Your top skills and tools</label>
                <div className="col-span-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md py-1 px-3"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 mt-1">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">How much work experience do you have?</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">4 years</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 items-center">
                <label className="text-black font-medium ">Education</label>
                <div className="col-span-3">
                  <div className="flex items-center border rounded-md p-2">
                    <span className="flex-1 text-gray-900">BS in Computer Science</span>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
