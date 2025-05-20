import { MatchedJobCard } from "./job-card";
import { AppliedJobsCard } from "./applied-jobs-card";
import { UserProfileHeader } from "./user-profile-header";

export function MatchedJobs() {
  return (
    <div>
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Matched Jobs</h2>
        <UserProfileHeader />
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[58%] grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
          <MatchedJobCard
            title="UI/UX Intern"
            company="Jobstar"
            location="Shanghai China"
            salary="$ 35,000 /y"
            gradient="linear-gradient(100.95deg, #276EFE 1.25%, #5F92F9 98.75%)"
            shadow="0px 4px 4px 0px #4682FB47"
            tags={["Onsite", "Internship"]}
          />
          <MatchedJobCard
            title="UX Designers"
            company="Etisalat"
            location="Shanghai China"
            salary="$ 35,000 /y"
            gradient="linear-gradient(102.25deg, #F4AA53 0.46%, #F1977D 99.54%)"
            shadow="0px 4px 4px 0px #F4A75B4F"
            tags={["Onsite", "Internship"]}
          />
          <MatchedJobCard
            title="UI/UX Designer"
            company="Etisalat"
            location="Shanghai China"
            salary="$ 35,000 /y"
            gradient="linear-gradient(102.25deg, #D679ED 0.46%, #B37BEE 99.54%)"
            shadow="0px 4px 4px 0px #CF7AEE4A"
            tags={["Onsite", "Internship"]}
          />
        </div>
        <div className="w-full lg:w-[40%] text-black">
          <AppliedJobsCard count={46} />
        </div>
      </div>
    </div>
  );
}