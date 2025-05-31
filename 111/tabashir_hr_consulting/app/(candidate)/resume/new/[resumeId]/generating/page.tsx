"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { useResumeStore } from "../../store/resume-store"

export default function GeneratingPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const resumeId = use(params)
  const setResumeGenerated = useResumeStore((state) => state.setResumeGenerated)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Use the proper store action
          setResumeGenerated(true)

          // Redirect to download page after completion
          setTimeout(() => {
            router.push(`/resume/new/${resumeId}/download`)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 300)

    return () => clearInterval(interval)
  }, [resumeId, router, setResumeGenerated])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center rounded-[6px]">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Resume</h1>
      <p className="text-gray-600 mb-8">Please wait while we create your professional resume...</p>

      <div className="w-full mb-4">
        <Progress value={progress} className="h-2 w-full" />
      </div>

      <div className="text-sm text-gray-500 mt-2">
        {progress < 30 && "Analyzing your information..."}
        {progress >= 30 && progress < 60 && "Formatting your resume..."}
        {progress >= 60 && progress < 90 && "Applying professional styling..."}
        {progress >= 90 && "Finalizing your resume..."}
      </div>
    </div>
  )
}
