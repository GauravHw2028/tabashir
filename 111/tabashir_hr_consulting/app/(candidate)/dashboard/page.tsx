import { MatchedJobs } from "./_components/matched-jobs"
import { SkillTrendsChart } from "./_components/skill-trends-chart"
import { MatchingJobsChart } from "./_components/matching-jobs-chart"
import { GlobalDemandList } from "./_components/global-demand-list"
import { InterviewScheduleCard } from "./_components/interview-schedule-card"
import { JobOffersCard } from "./_components/job-offers-card"
import { onGetUserProfile } from "@/actions/auth"

export default async function Dashboard() {
  const user = await onGetUserProfile()
  return (
    <div className="space-y-2  overflow-y-scroll max-h-[calc(100vh-35px)] ">
      <MatchedJobs jobType={user?.jobType || ""} />

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <SkillTrendsChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <MatchingJobsChart />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm text-gray-900">
          <GlobalDemandList />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <InterviewScheduleCard />
          <JobOffersCard />
        </div>
      </div>
    </div>
  )
}
