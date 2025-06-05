export const getJobs = async (
  location?: string,
  jobType?: string,
  salaryMin?: string,
  salaryMax?: string,
  experience?: string,
  attendance?: string,
  query?: string,
  sort?: "newest" | "oldest" | "salary_asc" | "salary_desc"
) => {
  try {
    const params = new URLSearchParams()

    // Add filters only if they have values
    if (location) params.append("location", location)
    if (jobType) params.append("jobType", jobType)
    if (salaryMin) params.append("salaryMin", salaryMin)
    if (salaryMax) params.append("salaryMax", salaryMax)
    if (experience) params.append("experience", experience)
    if (attendance) params.append("attendance", attendance)
    if (query) params.append("search", query)
    if (sort) params.append("sort", sort)

    // Add default limit
    params.append("limit", "10")

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/jobs?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    const data = await response.json()
    return { success: data.success, data: data.jobs }
  } catch (error) {
    console.error(error)
    return { success: false, error: error }
  }
}

export const getJobById = async (jobId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/jobs/${jobId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    const data = await response.json()
    return { success: data.success, data: data.job }
  } catch (error) {
    console.error(error)
    return { success: false, error: error }
  }
}

