"use client"

import type React from "react"

import { useEffect, useState, use } from "react"
import { Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ResumeSidebar } from "../_components/resume-sidebar"
import { useResumeStore } from "../store/resume-store"
import { cn } from "@/lib/utils"

export default function ResumeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ resumeId: string }>
}) {
  const { resumeId } = use(params)
  const [resumeScore, setResumeScore] = useState(0)
  const { getResumeScore, isSidebarVisible } = useResumeStore()

  // Update score whenever relevant state changes
  useEffect(() => {
    // Force re-calculation of score by directly calling the function
    const score = useResumeStore.getState().getResumeScore()
    setResumeScore(score)

    // Set up a subscription to the store to update score when state changes
    const unsubscribe = useResumeStore.subscribe((state) => {
      const newScore = state.getResumeScore()
      if (newScore !== resumeScore) {
        setResumeScore(newScore)
      }
    })

    return () => unsubscribe()
  }, [resumeScore])

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score < 30) return "bg-red-500"
    if (score < 60) return "bg-yellow-500"
    if (score < 100) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Full width header card */}
      <Card className="rounded-[6px] bg-white p-4 mb-6" style={{ boxShadow: "0px 4px 4px 0px #00000040" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-1">Sami-Haider-Resume</h2>
              <div className="flex items-center gap-2">
                <div className={`${getScoreColor(resumeScore)} text-gray-50 text-xs px-2 py-0.5 rounded`}>
                  {resumeScore}%
                </div>
                <span className="text-sm font-medium text-gray-700">Resume Score</span>
              </div>
              <Progress value={resumeScore} className="h-2 w-full mt-1 bg-gray-200" />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-gray-700 mt-2 sm:mt-0">
              <Info size={16} />
              <span>Tips</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Sidebar and content area */}
      <div className="flex">
        {/* Sidebar - only visible when isSidebarVisible is true */}
        {isSidebarVisible && <ResumeSidebar resumeId={resumeId} />}

        {/* Main content - takes full width when sidebar is hidden */}
        <div className={cn("flex-1 transition-all duration-300")}>
          {/* Main Content with spacing */}
          <div className="px-6">
            <div
              className="max-w-3xl mx-auto bg-white p-6 rounded-md"
              style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
