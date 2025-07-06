"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AiResumeStatus } from "@prisma/client"
import { getCV, getAiResumeFormatedContent } from "@/actions/ai-resume"
import { changeAiResumeStatus, updateAiResumeRawData, uploadAIResume } from "@/actions/resume"
import { useResumeStore } from "../../store/resume-store"

export const useCVGenerator = (resumeId: string, userId: string) => {
  const [generatingCV, setGeneratingCV] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { setResumeGenerated } = useResumeStore()
  const token = process.env.NEXT_PUBLIC_API_TOKEN

  const handleGenerateCV = async () => {
    console.log("🚀 handleGenerateCV called - Starting CV generation process...")
    setGeneratingCV(true)

    try {
      // Check if resume has existing formatted content or generated file
      console.log("📡 Checking existing resume content...")
      const existingContentResult = await getAiResumeFormatedContent(resumeId)

      console.log("📊 getAiResumeFormatedContent result:", existingContentResult)

      if (existingContentResult.error) {
        console.error("❌ Error getting formatted content:", existingContentResult.message)
        toast({
          title: "Error",
          description: existingContentResult.message,
          variant: "destructive",
        })
        return
      }

      const { hasExistingContent, hasGeneratedResume, formatedContent, formatedUrl, status } = existingContentResult.data || {}

      console.log("🔍 Resume status check detailed:", {
        hasExistingContent,
        hasGeneratedResume,
        status,
        hasFormatedContent: !!formatedContent,
        hasFormatedUrl: !!formatedUrl,
        formatedContentLength: formatedContent ? formatedContent.length : 0,
        formatedUrl: formatedUrl ? formatedUrl.substring(0, 50) + "..." : null,
        resumeId
      })

      // If resume is already generated and has a downloadable file, just go to download page
      // if (hasGeneratedResume && formatedUrl) {
      //   console.log("🎯 CONDITION 1: Resume already generated, redirecting to download page...")
      //   console.log("✅ hasGeneratedResume:", hasGeneratedResume)
      //   console.log("✅ formatedUrl:", formatedUrl)
      //   console.log("🚨 NO API CALLS WILL BE MADE - REDIRECTING TO DOWNLOAD PAGE")
      //   console.log("🚨 API CALLS WILL BE MADE", hasExistingContent)
      //   console.log("🚨 API CALLS WILL BE MADE", formatedContent)
      //   setResumeGenerated(true)
      //   router.push(`/resume/new/${resumeId}/download`)
      //   return
      // }

      // If we have existing formatted content but no generated file, use new API
      if (hasExistingContent && formatedContent) {
        console.log("Using existing formatted content for generation with new API...")

        let parsedFormatedContent
        try {
          parsedFormatedContent = JSON.parse(formatedContent)
        } catch (error) {
          console.error("Failed to parse existing formatted content:", error)
          toast({
            title: "Error",
            description: "Failed to parse existing formatted content",
            variant: "destructive",
          })
          return
        }

        console.log("Calling generate-docx-from-json API...")
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/generate-docx-from-json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-TOKEN": `${token}`,
          },
          body: JSON.stringify({
            cv_data: parsedFormatedContent,
            output_language: "regular"
          }),
        })

        if (!response.ok) {
          console.error("Failed to generate CV from existing content:", response.status, response.statusText)
          toast({
            title: "Error",
            description: "Failed to generate CV from existing content",
            variant: "destructive",
          })
          return
        }

        const file = await response.arrayBuffer()

        if (!file) {
          console.log("Failed to generate CV", file)
          toast({
            title: "Error",
            description: "Failed to generate CV",
            variant: "destructive",
          })
          return
        }

        // Convert ArrayBuffer to Blob
        console.log("Converting ArrayBuffer to Blob......")
        const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

        // Create a File object from the Blob
        const namedFile = new File([blob], `resume_${resumeId}.docx`, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

        // Upload to UploadThing
        const uploadResult = await uploadAIResume(namedFile, resumeId)

        if (uploadResult.error) {
          toast({
            title: "Error",
            description: uploadResult.message,
            variant: "destructive",
          })
          return
        }

        await changeAiResumeStatus(resumeId, AiResumeStatus.COMPLETED)

        toast({
          title: "Success",
          description: "CV generated and saved successfully",
        })

        setResumeGenerated(true)
        router.push(`/resume/new/${resumeId}/download`)

      } else {
        // First time generation - use the original APIs
        console.log("First time generation, using original APIs (format-from-raw & format-cv-object)...")

        const data = await getCV(resumeId)
        console.log("CV data:", data)

        if (data.error) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          })
          return
        }

        console.log("Generating CV WITH AI using original APIs...")
        console.log("API calls:", {
          formatFromRaw: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/format-from-raw`,
          formatCvObject: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/format-cv-object`
        })

        // Run both requests in parallel
        const [response, responseRawJson] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/format-from-raw`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-TOKEN": `${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              raw_data: JSON.stringify(data.data),
              output_language: "regular"
            }),
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/format-cv-object`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-TOKEN": `${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              raw_data: JSON.stringify(data.data),
              output_language: "regular"
            }),
          })
        ])

        // Check if both requests were successful
        if (!response.ok) {
          console.error("Failed to generate CV:", response.status, response.statusText)
          toast({
            title: "Error",
            description: "Failed to generate CV from server",
            variant: "destructive",
          })
          return
        }

        if (!responseRawJson.ok) {
          console.error("Failed to get CV object:", responseRawJson.status, responseRawJson.statusText)
          toast({
            title: "Error",
            description: "Failed to get CV object from server",
            variant: "destructive",
          })
          return
        }

        const file = await response.arrayBuffer()
        const jsonData = await responseRawJson.json()

        // Update the formatted content in the database
        await updateAiResumeRawData(resumeId, JSON.stringify(jsonData.formatted_resume))
        await changeAiResumeStatus(resumeId, AiResumeStatus.COMPLETED)

        console.log("CV object data:", jsonData)

        if (!file) {
          console.log("Failed to generate CV", file)
          toast({
            title: "Error",
            description: "Failed to generate CV",
            variant: "destructive",
          })
          return
        }

        // Convert ArrayBuffer to Blob
        console.log("Converting ArrayBuffer to Blob......")
        const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

        // Create a File object from the Blob
        const namedFile = new File([blob], `resume_${resumeId}.docx`, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

        // Upload to UploadThing
        const uploadResult = await uploadAIResume(namedFile, resumeId)

        if (uploadResult.error) {
          toast({
            title: "Error",
            description: uploadResult.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Success",
          description: "CV generated and saved successfully",
        })

        setResumeGenerated(true)
        router.push(`/resume/new/${resumeId}/download`)
      }

    } catch (error) {
      console.error("Error generating CV:", error)
      toast({
        title: "Error",
        description: "Failed to generate CV",
        variant: "destructive",
      })
    } finally {
      setGeneratingCV(false)
    }
  }

  return {
    generatingCV,
    handleGenerateCV,
  }
} 