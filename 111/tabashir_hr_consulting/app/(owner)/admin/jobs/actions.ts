"use server"

import { prisma } from "@/lib/prisma"

export async function getJobs(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      prisma.job.count()
    ]);
    
    return {
      jobs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw new Error('Failed to fetch jobs')
  }
} 