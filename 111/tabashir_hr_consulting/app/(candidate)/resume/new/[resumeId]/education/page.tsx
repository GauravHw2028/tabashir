import { prisma } from "@/app/utils/db"
import EducationForm from "./education-form"

export default async function EducationPage({ params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params

  const aiResumeEducation = await prisma.aiEducation.findMany({
    where: {
      aiResumeId: resumeId,
    },
  })

  return <EducationForm resumeId={resumeId} aiResumeEducation={aiResumeEducation} />
}