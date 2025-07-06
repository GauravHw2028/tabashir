import { prisma } from "@/app/utils/db";
import ProfessionalSummaryForm from "./professional-summary-form";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export default async function ProfessionalSummaryPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const aiResumeProfessionalSummary = await prisma?.aiProfessionalDetails.findFirst({
    where: {
      aiResumeId: resumeId,
    },
  });

  return (
    <ProfessionalSummaryForm resumeId={resumeId} aiResumeProfessionalSummary={aiResumeProfessionalSummary} userId={session.user.id} />
  )
}
