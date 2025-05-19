"use server"


import { auth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/db"
import { revalidatePath } from "next/cache"

export async function createJob(formData: {
  jobTitle: string
  company: string
  companyDescription: string
  companyLogo: string
  jobType: string
  salaryMin: string
  salaryMax: string
  location?: string
  description: string
  requirements: string
  benefits: string[]
  applicationDeadline?: string
  contactEmail?: string
  contactPhone?: string
  requiredSkills: string[]
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // Get the owner record
    const owner = await prisma.owner.findUnique({
      where: { userId: session.user.id }
    })

    if (!owner) {
      throw new Error("Owner not found")
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        title: formData.jobTitle,
        company: formData.company,
        companyDescription: formData.companyDescription,
        companyLogo: formData.companyLogo,
        jobType: formData.jobType,
        salaryMin: parseInt(formData.salaryMin.replace(/,/g, '')),
        salaryMax: parseInt(formData.salaryMax.replace(/,/g, '')),
        location: formData.location,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : null,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        requiredSkills: formData.requiredSkills,
        ownerId: owner.id
      }
    })

    revalidatePath("/admin/jobs")
    return { success: true, jobId: job.id }
  } catch (error) {
    console.error("Error creating job:", error)
    return { success: false, error: "Failed to create job" }
  }
} 