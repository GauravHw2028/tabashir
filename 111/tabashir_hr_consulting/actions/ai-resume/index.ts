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

  console.log(session, "Session")

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

  
  
  const personalDetails = await prisma.aiResumePersonalDetails.upsert({
    where: {
      aiResumeId: aiResumeId,
    },
    update: {
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
    create: {
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

  console.log(personalDetails, "Personal Details saved successfully!")

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

export async function onSaveProfessionalSummary(aiResumeId: string, data: {
  summary: string;
}) {
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

  const professionalSummary = await prisma.aiProfessionalDetails.upsert({
    where: {
      aiResumeId: aiResumeId,
    },
    update: {
      summary: data.summary,
    },
    create: {
      aiResumeId: aiResumeId,
      summary: data.summary,
    },
  });

  if (!professionalSummary) {
    return { error: true, message: "Failed to save professional summary" };
  }

  revalidatePath(`/resume/new`, "layout");
  return {
    error: false,
    message: "Professional summary saved",
  };
}

export async function onSaveEmploymentHistory(aiResumeId: string, data: {
  jobs: {
    jobTitle: string;
    companyName: string;
    country: string;
    city: string;
    startDate: string;
    endDate?: string | undefined;
    isPresent: boolean;
  }[];
}) {
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

  try {
    // First verify that the resume exists
    const resume = await prisma.aiResume.findUnique({
      where: {
        id: aiResumeId,
      },
    });

    if (!resume) {
      return { error: true, message: "Resume not found" };
    }

    // Delete existing employment history records for this resume
    await prisma.aiEmploymentHistory.deleteMany({
      where: {
        aiResumeId: aiResumeId,
      },
    });

    const employmentHistory = await prisma.aiEmploymentHistory.createMany({
      data: data.jobs.map((job) => ({
        aiResumeId: aiResumeId,
        company: job.companyName,
        position: job.jobTitle,
        country: job.country, 
        city: job.city,
        startDate: new Date(job.startDate),
        endDate: job.endDate ? new Date(job.endDate) : null,
        current: job.isPresent,
        description: "",
      })),
    });

    console.log(employmentHistory, "Employment history saved successfully!")

    if (!employmentHistory) {
      return { error: true, message: "Failed to save employment history" };
    }

    // Update the resume progress
    await prisma.aiResume.update({
      where: {
        id: aiResumeId,
      },
      data: { progress: 40 },
    });

    revalidatePath(`/resume/new`, "layout");
    return {
      error: false,
      message: "Employment history saved",
    };
  } catch (error) {
    console.error("Error saving employment history:", error);
    return { error: true, message: "Failed to save employment history" };
  }
}

export async function onSaveEducation(aiResumeId: string, data: {
  education: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    city: string;
    description?: string | undefined;
  }[];
}) {
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

  try {
    // First verify that the resume exists
    const resume = await prisma.aiResume.findUnique({
      where: {
        id: aiResumeId,
      },
    });

    if (!resume) {
      return { error: true, message: "Resume not found" };
    }

    // Delete existing education records for this resume
    await prisma.aiEducation.deleteMany({
      where: {
        aiResumeId: aiResumeId,
      },
    });

    const education = await prisma.aiEducation.createMany({
      data: data.education.map((education) => ({
        aiResumeId: aiResumeId,
        institution: education.school,
        degree: education.degree,
        field: "",
        city: education.city,
        startDate: new Date(education.startDate), 
        endDate: education.endDate ? new Date(education.endDate) : null,
        current: false,
        achievements: education.description ? education.description.split(",") : [],
      })),
    });

    console.log(education, "Education saved successfully!")

    if (!education) {
      return { error: true, message: "Failed to save education" };
    }

    // Update the resume progress
    await prisma.aiResume.update({
      where: {
        id: aiResumeId,
      },
      data: { progress: 60 },
    });

    revalidatePath(`/resume/new`, "layout");
    return {
      error: false,
      message: "Education saved",
    };
  } catch (error) {
    console.error("Error saving education:", error);
    return { error: true, message: "Failed to save education" };
  }
}

export async function onSaveSkills(aiResumeId: string, data: {
  skills: {
    name: string;
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    category: string;
  }[];
}) {
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

  try {
    // First verify that the resume exists
    const resume = await prisma.aiResume.findUnique({
      where: {
        id: aiResumeId,
      },
    });

    if (!resume) {
      return { error: true, message: "Resume not found" };
    }

    // Delete existing skills records for this resume
    await prisma.aiSkill.deleteMany({
      where: {
        aiResumeId: aiResumeId,
      },
    });

    const skills = await prisma.aiSkill.createMany({
      data: data.skills.map((skill) => ({
        aiResumeId: aiResumeId,
        name: skill.name,
        level: skill.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
        category: skill.category,
      })),
    });

    console.log(skills, "Skills saved successfully!")

    if (!skills) {
      return { error: true, message: "Failed to save skills" };
    }

    // Update the resume progress
    await prisma.aiResume.update({
      where: {
        id: aiResumeId,
      },
      data: { progress: 80 },
    });

    revalidatePath(`/resume/new`, "layout");
    return {
      error: false,
      message: "Skills saved",
    };
  } catch (error) {
    console.error("Error saving skills:", error);
    return { error: true, message: "Failed to save skills" };
  }
}

export async function getCV(resumeId: string) {
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

  const resume = await prisma.aiResume.findUnique({
    where: { id: resumeId },
  });

  if (!resume) {
    return { error: true, message: "Resume not found" };
  }

  const cvPersonalDetails = await prisma.aiResumePersonalDetails.findUnique({
    where: { aiResumeId: resumeId },
  });

  const cvProfessionalSummary = await prisma.aiProfessionalDetails.findUnique({
    where: { aiResumeId: resumeId },
  });

  const cvEmploymentHistory = await prisma.aiEmploymentHistory.findMany({
    where: { aiResumeId: resumeId },
  });

  const cvEducation = await prisma.aiEducation.findMany({
    where: { aiResumeId: resumeId },
  });

  const cvSkills = await prisma.aiSkill.findMany({
    where: { aiResumeId: resumeId },
  });

  return {
    error: false,
    message: "CV generated successfully!",
    data: {
      resume,
      cvPersonalDetails,
      cvProfessionalSummary,
      cvEmploymentHistory,
      cvEducation,
      cvSkills,
    },
  };
}

export async function getResumeScore(resumeId: string) {
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

  const resume = await prisma.aiResume.findUnique({
    where: {
      id: resumeId,
    },
  });



  if (!resume) {
    return { error: true, message: "Resume not found" };
  }
  
  let score = 0;

  const personalDetails = await prisma.aiResumePersonalDetails.findUnique({
    where: {
      aiResumeId: resumeId,
    },
  });

  console.log(personalDetails, "Personal Details")

  if (personalDetails) {
    score += 20;
  }

  const professionalSummary = await prisma.aiProfessionalDetails.findUnique({
    where: {
      aiResumeId: resumeId,
    },
  });

  console.log(professionalSummary, "Professional Summary")

  if (professionalSummary) {
    score += 20;
  }

  const employmentHistory = await prisma.aiEmploymentHistory.findMany({
    where: {
      aiResumeId: resumeId,
    },
  }); 

  console.log(employmentHistory, "Employment History")

  if (employmentHistory.length > 0) {
    score += 20;
  }

  const education = await prisma.aiEducation.findMany({
    where: {
      aiResumeId: resumeId,
    },
  });

  console.log(education, "Education")

  if (education.length > 0) {
    score += 20;
  }

  const skills = await prisma.aiSkill.findMany({
    where: {
      aiResumeId: resumeId,
    },
  });

  console.log(skills, "Skills")

  if (skills.length > 0) {
    score += 20;
  }
  
  return {
    error: false,
    message: "Resume score calculated successfully!",
    score: score,
    data: {
      "personal-details": personalDetails ? true : false,
      "professional-summary": professionalSummary ? true : false,
      "employment-history": employmentHistory.length > 0 ? true : false,
      "education": education.length > 0 ? true : false,
      "skills": skills.length > 0 ? true : false,
    }
  };
  
}