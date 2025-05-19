"use client"

import type React from "react"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ApplicationFormProps {
  form: UseFormReturn<any>
  onNext: () => void
  onPrev: () => void
}

export default function ApplicationForm({ form, onNext, onPrev }: ApplicationFormProps) {
  const [applicationType, setApplicationType] = useState<"easy" | "screening">("easy")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="text-gray-900">
      <h2 className="text-xl font-semibold mb-6">Application</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">User Application Process</h3>

          {/* Only Easy Apply option */}
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <span className="text-blue-600">Easy Apply</span>
            </div>
          </div>

          {/* Contact Email Input */}
          <div className="space-y-2 mb-6">
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <Input placeholder="Type recruiter email" type="email" className="border-gray-300" />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button type="submit" className="bg-blue-950 hover:blue-gradient transition-all duration-200 text-white">
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
