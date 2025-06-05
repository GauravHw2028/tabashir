"use server"

import { auth } from "@/app/utils/auth";
import { prisma } from "@/lib/prisma"

export const onLikeJob = async (jobId: string) => {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const jobLike = await prisma.jobLike.create({
      data: {
        jobId,
        userId: session.user.id,
      },
    })

    return { success: "Job liked" }
  } catch (error) {
    return { error: "Failed to like job" }
  }
}

export const onUnlikeJob = async (jobId: string) => {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const jobLike = await prisma.jobLike.deleteMany({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    })

    return { success: "Job unliked" }
  } catch (error) {
    return { error: "Failed to unlike job" }
  }
}

export const getLikedJobs = async () => {
  const session = await auth()
  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    const jobLikes = await prisma.jobLike.findMany({
      where: {
        userId: session.user.id,
      },
    })

    return { success: jobLikes }
  } catch (error) {
    return { error: "Failed to get liked jobs" }
  }
}

export const getIsLiked = async (jobId: string) => {
  const session = await auth()
  if (!session?.user) {
    return false
  }

  const jobLike = await prisma.jobLike.findFirst({
    where: {
      jobId: jobId,
      userId: session.user.id,
    },
  })

  return jobLike ? true : false
}
