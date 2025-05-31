import EmploymentHistoryForm from "./employment-history-form";
import { prisma } from "@/app/utils/db";

export default async function EmploymentHistoryPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;

  const aiResumeEmploymentHistory = await prisma.aiEmploymentHistory.findMany({
    where: {
      aiResumeId: resumeId,
    },
  });

  return (
    <EmploymentHistoryForm resumeId={resumeId} aiResumeEmploymentHistory={aiResumeEmploymentHistory} />
  )
}
