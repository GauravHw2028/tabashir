"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import JobCard from "@/components/job-card";
import { UserProfileHeader } from "../dashboard/_components/user-profile-header";
import { getLikedJobs, onLikeJob, onUnlikeJob } from "@/actions/job";
import { getJobById } from "@/lib/api";
import { toast } from "sonner";
import type { Job } from "../jobs/_components/types";
import { JobDetails } from "../jobs/_components/job-details";
import { useSession } from "next-auth/react";

// Custom JobCard wrapper for liked jobs that handles unlike callbacks
function LikedJobCard({ job, onClick, isSelected, onUnlike }: {
  job: Job;
  onClick: () => void;
  isSelected?: boolean;
  onUnlike?: (jobId: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(true); // Start as liked since this is a liked job

  const handleLike = async () => {
    setIsLiked(true)
    const result = await onLikeJob(job.id)
    if (!result.success) {
      toast.error(result.error)
      setIsLiked(false)
    }
  }

  const handleUnlike = async () => {
    setIsLiked(false)
    const result = await onUnlikeJob(job.id)
    if (result.success) {
      // Call the onUnlike callback to update the parent component
      onUnlike?.(job.id)
    } else {
      toast.error(result.error)
      setIsLiked(true)
    }
  }

  return (
    <div
      className={`bg-white rounded-lg p-4 cursor-pointer transition-all shadow-md hover:shadow-lg ${isSelected ? "bg-[#E9F5FF] border-2 border-blue-500" : ""
        }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={job.logo || "/placeholder.svg"}
            alt={job.company}
            width={74}
            height={74}
            className="w-full h-full object-contain p-2"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg text-gray-900">{job.title}</h3>
              <p className="text-base text-gray-600">{job.company}</p>
            </div>

            <div className="flex items-start gap-2">
              {job.match && (
                <div
                  className={`px-3 py-1 rounded-full text-xs text-white ${job.match.type === "top"
                    ? "bg-orange-500"
                    : job.match.type === "best"
                      ? "bg-blue-500"
                      : "bg-pink-500"
                    }`}
                >
                  {job.match.type === "top"
                    ? "Top Match"
                    : job.match.type === "best"
                      ? "Best For You"
                      : `${job.match.value}% Match`}
                </div>
              )}

              <button
                className={`text-gray-400 hover:text-red-500 ${isLiked ? "text-red-500" : ""}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card onClick
                  if (isLiked) {
                    handleUnlike();
                  } else {
                    handleLike();
                  }
                }}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.location}</span>
            </div>
            <div>{job.views} views</div>
            <div>{job.postedTime}</div>
            <div>{job.jobType}</div>
            <div>{job.applicationsCount} applied</div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                Team
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                {job.department}
              </div>
            </div>

            <div className="text-sm font-medium text-blue-500">
              {job.salary.amount}
              <span className="text-xs text-gray-500">
                {job.salary && job.salary.period ? `/${job.salary.period}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LikedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();
  const fetchLikedJobs = async () => {
    setLoading(true);
    try {
      // Get liked job IDs from server action
      const likedJobsResult = await getLikedJobs();

      if (likedJobsResult.error) {
        toast.error(likedJobsResult.error);
        setLoading(false);
        return;
      }

      if (!likedJobsResult.success || likedJobsResult.success.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      // Fetch individual job details for each liked job
      const jobPromises = likedJobsResult.success.map(async (likedJob: any) => {
        const jobResult = await getJobById(likedJob.jobId);
        if (jobResult.success && jobResult.data) {
          // Transform API data to match frontend Job type
          const transformedJob: Job = {
            id: jobResult.data.id.toString(),
            title: jobResult.data.job_title,
            company: jobResult.data.entity,
            logo: jobResult.data.logo || "",
            location: jobResult.data.vacancy_city,
            postedTime: new Date(jobResult.data.job_date).toLocaleDateString(),
            jobType: jobResult.data.working_days,
            applicationsCount: 0, // Not available from API
            views: 0, // Not available from API
            salary: {
              amount: jobResult.data.salary || "Not specified",
              currency: "AED",
              period: "month"
            },
            description: jobResult.data.job_description,
            requirements: jobResult.data.academic_qualification,
            department: jobResult.data.job_title,
            team: jobResult.data.entity,
            isLikded: true,
            match: {
              type: "percentage" as const,
              value: 85 // Default match percentage
            },
          };
          return transformedJob;
        }
        return null;
      });

      const jobsData = await Promise.all(jobPromises);
      const validJobs = jobsData.filter((job): job is Job => job !== null);

      setJobs(validJobs);
    } catch (error) {
      console.error("Error fetching liked jobs:", error);
      toast.error("Failed to fetch liked jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedJobs();
  }, []);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobUnlike = (jobId: string) => {
    // Remove the job from the list
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    // If the currently selected job was unliked, clear the selection
    if (selectedJob?.id === jobId) {
      setSelectedJob(null);
    }
  };

  // Function to refresh liked jobs (can be called when jobs are unliked)
  const refreshLikedJobs = () => {
    fetchLikedJobs();
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="px-6 py-2 bg-white rounded-md mx-auto max-h-[calc(100vh-35px)] overflow-y-scroll">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading liked jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row gap-6 rounded-lg max-h-[calc(100vh-35px)] relative">
      {/* Job listings */}
      <div className={`flex-1 overflow-y-scroll rounded-lg bg-white ${selectedJob ? 'hidden lg:block lg:flex-1' : ''}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900">Liked Jobs</h1>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <UserProfileHeader />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search your liked jobs..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-full w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1 overflow-y-auto">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 mb-4 text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {jobs.length === 0 ? "No Liked Jobs Yet" : "No matching jobs found"}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {jobs.length === 0
                    ? "Start exploring job opportunities and save the ones you're interested in. Your liked jobs will appear here for easy access."
                    : "Try adjusting your search terms to find more liked jobs."
                  }
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {filteredJobs.map((job) => (
                  <LikedJobCard
                    key={job.id}
                    job={job}
                    onClick={() => handleJobSelect(job)}
                    isSelected={job.id === selectedJob?.id}
                    onUnlike={handleJobUnlike}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job details (conditionally rendered) */}
      {selectedJob && (
        <div className="fixed inset-0 lg:relative lg:inset-auto lg:w-[400px] bg-white rounded-lg shadow-sm overflow-y-auto flex-shrink-0 animate-in slide-in-from-right duration-300 z-50 lg:z-auto">
          <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} userId={session.data?.user?.id as string} />
        </div>
      )}
    </div>
  );
}

