import AiResumePersonalDetailsForm from "@/components/forms/ai-resume/personal-details";
import { prisma } from "@/app/utils/db";
import { AiResumePersonalDetails } from "@prisma/client";

export default async function PersonalDetailsPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const aiResumePersonalDetails =
    await prisma.aiResumePersonalDetails.findUnique({
      where: {
        id: resumeId,
      },
    });
  return (
    <div className="space-y-6 rounded-[6px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Personal Details
      </h2>

      <AiResumePersonalDetailsForm
        aiResumeId={resumeId}
        aiResumePersonalDetails={
          aiResumePersonalDetails as AiResumePersonalDetails
        }
      />
    </div>
  );
}
