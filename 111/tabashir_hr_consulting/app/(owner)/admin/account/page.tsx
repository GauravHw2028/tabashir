"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
    <div className="flex-1 p-6 h-full  text-gray-900">
      <div className=" mx-auto space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Personals Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Username</label>
              <div className="col-span-3">
                <div className="flex items-center border rounded-md p-2">
                  <span className="flex-1 text-gray-900">Zawar Ahmed Farooqi</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Gender</label>
              <div className="col-span-3">
                <div className="flex items-center border rounded-md p-2">
                  <span className="flex-1 text-gray-900">Male</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Profile Picture</label>
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
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Account Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Email</label>
              <div className="col-span-3">
                <div className="flex items-center border rounded-md p-2">
                  <span className="flex-1 text-gray-900">balamini@gmail.com</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Password</label>
              <div className="col-span-3">
                <div className="flex items-center border rounded-md p-2">
                  <span className="flex-1 text-gray-900">••••••••••••••</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label className="text-gray-700">Phone</label>
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
        </div>
      </div>
    </div>
  )
}
