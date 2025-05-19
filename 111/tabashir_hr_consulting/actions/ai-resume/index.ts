"use server";

import { auth } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";
import { aiResumePersonalDetailsSchema, AiResumePersonalDetailsSchemaType } from "@/components/forms/ai-resume/personal-details/schema";
import { revalidatePath } from "next/cache";

export async function onSetupResume() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: true, message: "Unauthenticated" };
  }

  if (session.user.userType !== "CANDIDATE") {
    return { error: true, message: "Unauthorized" };
  }

  const candidate = await prisma.candidate.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!candidate) {
    return { error: true, message: "Candidate not found" };
  }


  const resume = await prisma.aiResume.create({
    data: {
      candidateId: candidate.id,
      createdAt: new Date(),
      updatedAt: new Date(Date.now()),
    },
  });

  if (!resume) {
    return {
      error: true,
      message: "Failed to create resume",
      redirectTo: "/resume",
    };
  }

  return {
    error: false,
    message: "Resume created",
    data: resume,
    redirectTo: `/resume/new/${resume.id}/personal-details`,
  };
}


export async function onSavePersonalDetails(aiResumeId: string, data: AiResumePersonalDetailsSchemaType) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: true, message: "Unauthenticated" };
  }

  const candidate = await prisma.candidate.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!candidate) {
    return { error: true, message: "Candidate not found" };
  }
  
  
//  validate the data
  const validateData = aiResumePersonalDetailsSchema.parse(data);
  if (!validateData) {
    return { error: true, message: "Invalid data" };
  }
  
  const personalDetails = await prisma.aiResumePersonalDetails.create({
    data: {
      aiResumeId: aiResumeId,
      fullName: validateData.fullName,
      email: validateData.email,
      phone: validateData.phone,
      country: validateData.country,
      city: validateData.city,
      socialLinks: {
        create: validateData.socialLinks.map((link) => ({
          label: link.label,
          url: link.url,
        })),
      },
    },
  });

  if (!personalDetails) {
    return { error: true, message: "Failed to save personal details" };
  }

  // update the aiResutme progress
  const updatedResume = await prisma.aiResume.update({
    where: {
      id: aiResumeId,
    },
    data: { progress: 20 },
  });

  revalidatePath(`/resume/new`, "layout");
  return {
    error: false,
    message: "Personal details saved",
    data: personalDetails,
    redirectTo: `/resume/new/${aiResumeId}/professional-summary`,
  };
}

