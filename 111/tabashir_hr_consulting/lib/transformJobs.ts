export const transformJobs = (jobs: any) => {
  console.log(jobs)
  return jobs.map((job: any) => ({
    id: job.id.toString(),
    title: job.job_title,
    company: job.entity,
    logo: job.logo,
    entity: job.entity,
    location: job.vacancy_city,
    email: job.application_email,
    gender: job.gender,
    experience: job.experience,
    postedTime: job.job_date,
    jobType: job.working_days,
    salary: {
      amount: job.salary,
      currency: "AED",
      period: "month"
    },
    applyUrl: job.apply_url || job.link,
    website: job.website || job.link,
    job: job.source,
    description: job.job_description,
    requirements: job.academic_qualification,
    department: job.job_title,
    team: job.entity,
    match: {
      type: "percentage",
      value: 85 // Default match percentage
    },
  })).filter((job: any) => job.title !== "Nan" && job.title !== "nan")
}


export const transformJob = (job: any) => {
  return {
    id: job.id.toString(),
    title: job.job_title,
    company: job.entity,
    logo: job.logo,
    entity: job.entity,
    location: job.vacancy_city,
    email: job.application_email,
    gender: job.gender,
    experience: job.experience,
    postedTime: job.job_date,
    jobType: job.working_days,
    salary: {
      amount: job.salary,
      currency: "AED",
      period: "month"
    },
    applyUrl: job.apply_url || job.link,
    website: job.website || job.link,
    job: job.source,
    description: job.job_description,
    requirements: job.academic_qualification,
    department: job.job_title,
    team: job.entity,
    match: {
      type: "percentage",
      value: 85 // Default match percentage
    },
  }
}
