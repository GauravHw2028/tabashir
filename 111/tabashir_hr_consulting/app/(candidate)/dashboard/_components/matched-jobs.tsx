"use client"

import { MatchedJobCard } from "./job-card";
import { AppliedJobsCard } from "./applied-jobs-card";
import { UserProfileHeader } from "./user-profile-header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function MatchedJobs() {
  const [jobAppliedCount, setJobAppliedCount] = useState(0);
  const session = useSession();

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

  return (
    <div>
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Matched Jobs</h2>
        <div className="w-full flex justify-end mb-4">

          <UserProfileHeader />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[58%] grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
          <MatchedJobCard
            title="Software Developer"
            company="Jobstar"
            location="Dubai, UAE"
            salary="AED 150,000 /y"
            gradient="linear-gradient(100.95deg, #276EFE 1.25%, #5F92F9 98.75%)"
            shadow="0px 4px 4px 0px #4682FB47"
            tags={["Remote", "Full-time"]}
          />
          <MatchedJobCard
            title="Data Analyst"
            company="Etisalat"
            location="Abu Dhabi, UAE"
            salary="AED 120,000 /y"
            gradient="linear-gradient(102.25deg, #F4AA53 0.46%, #F1977D 99.54%)"
            shadow="0px 4px 4px 0px #F4A75B4F"
            tags={["Hybrid", "Full-time"]}
          />
          <MatchedJobCard
            title="Digital Marketing Specialist"
            company="Etisalat"
            location="Sharjah, UAE"
            salary="AED 100,000 /y"
            gradient="linear-gradient(102.25deg, #D679ED 0.46%, #B37BEE 99.54%)"
            shadow="0px 4px 4px 0px #CF7AEE4A"
            tags={["Onsite", "Full-time"]}
          />
        </div>
        <div className="w-full lg:w-[40%] text-black">
          <AppliedJobsCard count={jobAppliedCount} />
        </div>
      </div>
    </div>
  );
}