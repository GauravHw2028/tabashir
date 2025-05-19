"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import JobCard from "@/components/job-card";
import { UserProfileHeader } from "../dashboard/_components/user-profile-header";

// Mock data for liked jobs
const likedJobs = [
  {
    id: "1",
    title: "UX Designer, Google Pay",
    company: "Google Inc.",
    location: "Shanghai, China",
    views: "240 views",
    timePosted: "Today",
    jobType: "Full-time",
    applicationsCount: "5 applied",
    team: "Product and Design",
    salary: "125K",
    logo: "/google-logo.png",
    isLiked: true,
  },
  {
    id: "2",
    title: "Product Manager - Operating System (Facebook Reality Labs)",
    company: "Facebook",
    location: "Menlo Park, CA | Remote",
    views: "121 views",
    timePosted: "3 days ago",
    jobType: "Full-time",
    applicationsCount: "19 applied",
    team: "Product and Design",
    salary: "100K",
    logo: "/facebook-logo.png",
    isLiked: true,
  },
  {
    id: "3",
    title: "Senior Product Designer, Customer Journey",
    company: "Twitter",
    location: "San Francisco, California",
    views: "430 views",
    timePosted: "5 days ago",
    jobType: "Full-time",
    applicationsCount: "34 applied",
    team: "Product and Design",
    salary: "100K",
    logo: "/twitter-logo.png",
    isLiked: true,
  },
  {
    id: "4",
    title: "Senior Product Designer",
    company: "Apple Inc.",
    location: "California, United States",
    views: "5,570 views",
    timePosted: "1 week ago",
    jobType: "Full-time",
    applicationsCount: "150 applied",
    team: "Design",
    salary: "80K",
    logo: "/apple-logo.png",
    isLiked: true,
  },
  {
    id: "5",
    title: "UX Designer, Google Pay",
    company: "Google Inc.",
    location: "Shanghai, China",
    views: "240 views",
    timePosted: "Today",
    jobType: "Full-time",
    applicationsCount: "5 applied",
    team: "Product and Design",
    salary: "120K",
    logo: "/google-logo.png",
    isLiked: true,
  },
  {
    id: "6",
    title: "Senior Product Designer, Customer Journey",
    company: "Twitter",
    location: "San Francisco, California",
    views: "430 views",
    timePosted: "5 days ago",
    jobType: "Full-time",
    applicationsCount: "34 applied",
    team: "Product and Design",
    salary: "100K",
    logo: "/twitter-logo.png",
    isLiked: true,
  },
];

export default function LikedJobsPage() {
  const [jobs, setJobs] = useState(likedJobs);

  const handleUnlike = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="px-6 py-2 bg-white rounded-md mx-auto max-h-[calc(100vh-35px)] overflow-y-scroll">
      <div className="flex justify-between items-baseline">
        <div className="max-w-[70%] w-[70%] mb-6 ">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Category, Company or ..."
              className="pl-4 pr-10 py-3 border border-gray-300 rounded-full w-full text-sm text-gray-700"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-[#002B6B] text-white rounded-r-full px-4">
              <Search size={18} />
            </button>
          </div>
        </div>
        <UserProfileHeader />
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
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
              No Liked Jobs Yet
            </h3>
            <p className="text-gray-500 max-w-md">
              Start exploring job opportunities and save the ones you're
              interested in. Your liked jobs will appear here for easy access.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                id: job.id,
                company: job.company,
                jobType: job.jobType,
                location: job.location,
                logo: job.logo,
                postedTime: job.timePosted,
                salary: {
                  amount: job.salary,
                  currency: "AED",
                  period: "year",
                },
                title: job.title,
                isLikded: job.isLiked,
              }}
              onClick={() => handleUnlike(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

