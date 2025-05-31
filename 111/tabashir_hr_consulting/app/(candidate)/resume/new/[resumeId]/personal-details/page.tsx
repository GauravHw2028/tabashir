import AiResumePersonalDetailsForm from "@/components/forms/ai-resume/personal-details";
import { prisma } from "@/app/utils/db";
import { AiResumePersonalDetails, AiSocialLink } from "@prisma/client";

export default async function PersonalDetailsPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;

  const aiResumePersonalDetails =
    await prisma.aiResumePersonalDetails.findFirst({
      where: {
        aiResumeId: resumeId,
      },
      include: {
        socialLinks: true,
      },
    });

  console.log(resumeId)

  console.log("AI Resume Personal Details: ", aiResumePersonalDetails)

  return (
    <div className="space-y-6 rounded-[6px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Personal Details
      </h2>

      <AiResumePersonalDetailsForm
        aiResumeId={resumeId}
        aiResumePersonalDetails={
          aiResumePersonalDetails as AiResumePersonalDetails & { socialLinks: AiSocialLink[] }
        }
      />
    </div>
  );
}
