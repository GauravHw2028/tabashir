"use client"

import { MatchedJobCard } from "./job-card";
import { AppliedJobsCard } from "./applied-jobs-card";
import { UserProfileHeader } from "./user-profile-header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getJobs } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { Job } from "../../jobs/_components/types";
import { getAiJobApplyStatus } from "@/actions/ai-resume";
import { toast } from "sonner";

// Define the job interface based on API response
interface ApiJob {
  id: string;
  job_title: string;
  entity: string;
  vacancy_city: string;
  salary: string;
  working_days: string[];
  job_description: string;
  academic_qualification: string;
  job_date: string;
  logo?: string;
}

export function MatchedJobs({ jobType }: { jobType: string }) {
  const [jobAppliedCount, setJobAppliedCount] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobApplyCount, setJobApplyCount] = useState(0);
  const session = useSession();
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const response = await getJobs(undefined, undefined, undefined, undefined, undefined, jobType, undefined);
      if (response.success) {
        // Transform API data to match Job interface
        const transformedJobs = response.data.map((apiJob: ApiJob) => ({
          id: apiJob.id.toString(),
          title: apiJob.job_title,
          company: apiJob.entity,
          logo: apiJob.logo || "",
          location: apiJob.vacancy_city,
          postedTime: new Date(apiJob.job_date).toLocaleDateString(),
          jobType: Array.isArray(apiJob.working_days) ? apiJob.working_days.join(", ") : apiJob.working_days,
          salary: {
            amount: apiJob.salary,
            currency: "AED",
            period: "year"
          },
          description: apiJob.job_description,
          requirements: apiJob.academic_qualification,
          department: apiJob.job_title,
          team: apiJob.entity,
          match: {
            type: "percentage" as const,
            value: 85 // Default match percentage
          },
        }));
        setJobs(transformedJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session.data?.user?.email) {
      (async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/applied-jobs-count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.data?.user?.email
          })
        });
        const data = await response.json();

        if (data.success) {
          setJobAppliedCount(data.applied_jobs_count);
        }
      })();
    }
  }, [session.data?.user?.email]);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch AI job apply status
  // useEffect(() => {
  //   (async () => {
  //     const jobs = await getAiJobApplyStatus();

  //     if (!jobs.error) {
  //       setJobApplyCount(jobs.data?.jobCount || 0);
  //     } else {
  //       toast.error("Failed to fetch AI job apply status!");
  //     }
  //   })();
  // }, []);

  // Helper function to get tags for a job
  const getJobTags = (job: Job) => {
    if (job.jobType) {
      return job.jobType.split(", ");
    }
    return ["Full-time"];
  };

  // Handle job navigation to details page
  const handleJobSelect = (job: Job) => {
    router.push(`/job/${job.id}`);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
          <h2 className="text-lg sm:text-xl font-medium text-gray-800">Matched Jobs</h2>
          <div className="flex justify-end">
            <UserProfileHeader />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-[60%] 2xl:w-[58%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 text-black">
              {/* Loading skeletons */}
              <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-48 bg-gray-200 animate-pulse rounded-lg sm:col-span-2 xl:col-span-1"></div>
            </div>
          </div>
          <div className="w-full xl:w-[38%] 2xl:w-[40%] text-black">
            <AppliedJobsCard count={jobAppliedCount} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-800">Matched Jobs</h2>
        <div className="flex justify-end">
          <UserProfileHeader />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 mb-5">
        <div className="w-full xl:w-[60%] 2xl:w-[58%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 text-black">
            {/* Show purchase prompt if jobApplyCount is 0 */}
            {/* {jobApplyCount === 0 ? (
              <div className="col-span-full">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center h-[152px] flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Premium Jobs</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    You have no AI job applications remaining. Purchase a package to continue.
                  </p>
                  <button
                    onClick={() => router.push('/ai-job-apply')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm mx-auto"
                  >
                    Purchase Package
                  </button>
                </div>
              </div>
            ) : (
              <> */}
            {/* First job from API */}
            {jobs[0] && (
              <MatchedJobCard
                title={jobs[0].title}
                company={jobs[0].company}
                location={jobs[0].location}
                salary={typeof jobs[0].salary === 'object' ? `${jobs[0].salary.currency} ${jobs[0].salary.amount}/${jobs[0].salary.period}` : jobs[0].salary}
                gradient="linear-gradient(100.95deg, #276EFE 1.25%, #5F92F9 98.75%)"
                shadow="0px 4px 4px 0px #4682FB47"
                tags={getJobTags(jobs[0])}
                onApply={() => handleJobSelect(jobs[0])}
              />
            )}

            {/* Second job from API */}
            {jobs[1] && (
              <MatchedJobCard
                title={jobs[1].title}
                company={jobs[1].company}
                location={jobs[1].location}
                salary={typeof jobs[1].salary === 'object' ? `${jobs[1].salary.currency} ${jobs[1].salary.amount}/${jobs[1].salary.period}` : jobs[1].salary}
                gradient="linear-gradient(102.25deg, #F4AA53 0.46%, #F1977D 99.54%)"
                shadow="0px 4px 4px 0px #F4A75B4F"
                tags={getJobTags(jobs[1])}
                onApply={() => handleJobSelect(jobs[1])}
              />
            )}

            {/* Third job from API */}
            {jobs[2] && (
              <div className="sm:col-span-2 xl:col-span-1">
                <MatchedJobCard
                  title={jobs[2].title}
                  company={jobs[2].company}
                  location={jobs[2].location}
                  salary={typeof jobs[2].salary === 'object' ? `${jobs[2].salary.currency} ${jobs[2].salary.amount}/${jobs[2].salary.period}` : jobs[2].salary}
                  gradient="linear-gradient(102.25deg, #F4AA53 0.46%, #F1977D 99.54%)"
                  shadow="0px 4px 4px 0px #F4A75B4F"
                  tags={getJobTags(jobs[2])}
                  onApply={() => handleJobSelect(jobs[2])}
                />
              </div>
            )}
            {/* </>
            )} */}
          </div>
        </div>

        {/* Applied Jobs Card */}
        <div className="w-full xl:w-[38%] 2xl:w-[40%] text-black">
          <AppliedJobsCard count={jobAppliedCount} />
        </div>
      </div>
    </div>
  );
}