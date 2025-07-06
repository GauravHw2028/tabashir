import EmploymentHistoryForm from "./employment-history-form";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export default async function EmploymentHistoryPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const aiResumeEmploymentHistory = await prisma.aiEmploymentHistory.findMany({
    where: {
      aiResumeId: resumeId,
    },
  });

  return (
    <EmploymentHistoryForm resumeId={resumeId} aiResumeEmploymentHistory={aiResumeEmploymentHistory} userId={session.user.id} />
  )
}
