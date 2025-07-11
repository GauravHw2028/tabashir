"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/app/utils/auth"
import { revalidatePath } from "next/cache"

export async function submitEasyApply(jobId: string, resumeId?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        userId: session.user.id,
        applicationType: "easy_apply"
      }
    })

    if (existingApplication) {
      return { success: false, error: "You have already applied to this job via Easy Apply" }
    }

    // Get the job details to extract external job ID
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { externalApiJobId: true, title: true, company: true }
    })

    if (!job) {
      return { success: false, error: "Job not found" }
    }

    // Create the Easy Apply application entry
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId: session.user.id,
        applicationType: "easy_apply",
        resumeId: resumeId || null,
        externalJobId: job.externalApiJobId,
        status: "pending",
        matchedScore: 0
      }
    })

    // Increment the job applications count
    await prisma.job.update({
      where: { id: jobId },
      data: {
        applicationsCount: {
          increment: 1
        }
      }
    })

    // Revalidate relevant paths
    revalidatePath("/admin/applications")
    revalidatePath("/admin/jobs")
    revalidatePath("/admin/dashboard")

    return { 
      success: true, 
      applicationId: application.id,
      message: `Successfully applied to ${job.title} at ${job.company}` 
    }
  } catch (error) {
    console.error("Error submitting Easy Apply:", error)
    return { success: false, error: "Failed to submit application" }
  }
} 