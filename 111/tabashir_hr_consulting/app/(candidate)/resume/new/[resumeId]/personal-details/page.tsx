import AiResumePersonalDetailsForm from "@/components/forms/ai-resume/personal-details";
import { prisma } from "@/app/utils/db";
import { AiResumePersonalDetails, AiSocialLink } from "@prisma/client";
import { auth } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export default async function PersonalDetailsPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const aiResumePersonalDetails =
    await prisma.aiResumePersonalDetails.findFirst({
      where: {
        aiResumeId: resumeId,
      },
      include: {
        socialLinks: true,
      },
    });

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
        userId={session.user.id}
      />
    </div>
  );
}
