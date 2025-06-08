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
          <div className="relative h-full">
            <InterviewScheduleCard />
            <JobOffersCard />
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg pointer-events-none h-full">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="text-sm font-semibold">🚀 Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
