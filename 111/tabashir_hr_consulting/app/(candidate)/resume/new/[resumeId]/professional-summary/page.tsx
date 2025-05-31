import { prisma } from "@/app/utils/db";
import ProfessionalSummaryForm from "./professional-summary-form";

export default async function ProfessionalSummaryPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params;

  const aiResumeProfessionalSummary = await prisma?.aiProfessionalDetails.findFirst({
    where: {
      aiResumeId: resumeId,
    },
  });

  return (
    <ProfessionalSummaryForm resumeId={resumeId} aiResumeProfessionalSummary={aiResumeProfessionalSummary} />
  )
}
