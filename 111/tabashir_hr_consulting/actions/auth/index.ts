"use server"

import { loginFormSchema } from "@/app/utils/schemas";
import { z } from "zod";
import { signIn, signOut } from "@/app/utils/auth";
import { redirect } from "next/dist/server/api-utils";
import { registrationFormSchema, RegistrationFormSchemaType } from "@/components/forms/registration/candidate/schema";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { prisma } from '@/app/utils/db'
import bcrypt from "bcrypt";
import { auth } from "@/app/utils/auth";
import { candidatePersonalInfoFormSchema, CandidatePersonalInfoFormSchemaType } from "@/components/forms/onboarding/candidate/personal-info/schema";
import { candidateProfessionalInfoFormSchema, CandidateProfessionalInfoFormSchemaType } from "@/components/forms/onboarding/candidate/professional-info/schema";


// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function onLogin(data: z.infer<typeof loginFormSchema>) {
  const validate = loginFormSchema.parse(data)
  if (!validate) {
    return { error: true, message: "Invalid input data" }
  }

  const { email, password } = validate;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (!isUserExist || !isUserExist.password || !isUserExist.email) {
    return {
      error: true,
      message: "User not found"
    }
  }


  try {
    await signIn("credentials", {
      email: isUserExist.email,
      password: password,
      redirect: false,
    })
    const redirectTo = isUserExist.userType === "ADMIN" ? "/admin/dashboard" : isUserExist.userType === "CANDIDATE" ? "/dashboard" : ""
    return {
      error: false,
      message: "Successfully logged in!",

      redirectTo
    }
  } catch (error) {
    // Check if this is a redirect error
    console.error("Error: ", error)
    return { error: true, message: "Authentication failed" }
  }
}

export async function onLogout(redirectTo: string) {
  await signOut({
    redirectTo
  })
}

export async function updateOnboardingStatus(candidateId: string, isCompleted: boolean) {
  try {
    await prisma.candidateProfile.update({
      where: { candidateId },
      data: { onboardingCompleted: isCompleted }
    })

    return {
      error: false,
      redirectTo: "/dashboard"
    }
  } catch (error) {
    console.error("Error updating onboarding status:", error)
    return {
      error: true,
      message: "Failed to update onboarding status"
    }
  }
}

export async function onCandidateRegistration(data: RegistrationFormSchemaType) {
  const validate = registrationFormSchema.parse(data)
  if (!validate) {
    return {
      error: true,
      message: "Invalid data"
    }
  }

  const { email, username, password } = validate
  try {
    let isUserExist = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!isUserExist){
      isUserExist = await prisma.user.findUnique({
        where: {
          email: username
        }
      })
    }

    if (isUserExist) {
      return {
        error: true,
        message: "User already exist"
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: username,
        password: hashedPassword,
        userType: "CANDIDATE",
      },
    })

    if (!newUser) {
      return {
        error: true,
        message: "Failed to create new user!"
      }
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    return {
      error: false,
      message: "Successfully registered",
      redirectTo: `/candidate/${newUser.id}/callback`

    }
  } catch (error: any) {
    console.error(error)
    return {
      error: true,
      message: error.message
    }
  }
}

export async function onCandidatePersonalInfoOnboarding(data: CandidatePersonalInfoFormSchemaType) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthenticated")
    }

    const validate = candidatePersonalInfoFormSchema.parse(data)

    const { phone, nationality, gender, languages, age, profilePicture, referralCode } = validate

    // Update user's referral code if provided
    if (referralCode) {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          referralCode,
        },
      });
    }

    // First check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        profile: true
      }
    })

    let candidate;
    if (existingCandidate) {
      // Update existing candidate
      candidate = await prisma.candidate.update({
        where: {
          userId: session.user.id,
        },
        data: {
          profile: {
            upsert: {
              create: {
                phone,
                nationality,
                gender,
                languages,
                age: parseInt(age),
                profilePicture,
                onboardingCompleted: false,
              },
              update: {
                phone,
                nationality,
                gender,
                languages,
                age: parseInt(age),
                profilePicture,
                onboardingCompleted: false,
              }
            }
          }
        },
        include: {
          profile: true
        }
      })
    } else {
      // Create new candidate with profile
      candidate = await prisma.candidate.create({
        data: {
          userId: session.user.id,
          profile: {
            create: {
              phone,
              nationality,
              gender,
              languages,
              age: parseInt(age),
              profilePicture,
              onboardingCompleted: false,
            }
          }
        },
        include: {
          profile: true
        }
      })
    }

    if (!candidate) {
      return {
        error: true,
        message: "Failed to update personal information"
      }
    }

    return {
      error: false,
      message: "Personal information updated successfully",
      redirectTo: `/candidate/${session.user.id}/professional-info`
    }
  } catch (error: any) {
    console.error("[PROFESSIONAL_INFO_POST]", error)
    return {
      error: true,
      message: error.message
    }
  }
}

export async function onCandidateProfessionalInfoOnboarding(data: CandidateProfessionalInfoFormSchemaType) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Unauthenticated")
    }

    const validate = candidateProfessionalInfoFormSchema.parse(data)

    const { degree, education, experience, jobType, skills } = validate

    // First check if candidate exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        profile: true
      }
    })

    let candidate;
    if (existingCandidate) {
      // Update existing candidate
      candidate = await prisma.candidate.update({
        where: {
          userId: session.user.id,
        },
        data: {
          profile: {
            upsert: {
              create: {
                degree,
                education,
                experience,
                jobType,
                skills,
                onboardingCompleted: true
              },
              update: {
                degree,
                education,
                experience,
                jobType,
                skills,
                onboardingCompleted: true
              }
            }
          }
        },
        include: {
          profile: true
        }
      })
    } else {
      // Create new candidate with profile
      candidate = await prisma.candidate.create({
        data: {
          userId: session.user.id,
          profile: {
            create: {
              degree,
              education,
              experience,
              jobType,
              skills,
              onboardingCompleted: true
            }
          }
        },
        include: {
          profile: true
        }
      })
    }

    if (!candidate) {
      return {
        error: true,
        message: "Failed to update professional information"
      }
    }

    return {
      error: false,
      message: "Professional information updated successfully",
      redirectTo: `/dashboard`
    }
  } catch (error: any) {
    console.error("[PROFESSIONAL_INFO_POST]", error)
    return {
      error: true,
      message: error.message
    }
  }
}

export async function onGetUserProfile() {
  const session = await auth();
  const userId = session?.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
      email:true,
      userType:true,
      candidate: {
        select: {
          profile: {
            select: {
              profilePicture: true,
              jobType: true
            }
          }
        }
      },
    }
  });
  if(!user || !user.candidate) return null

  return {
    name:user.name as string,
    email:user.email as string,
    userType:user.userType as string,
    profilePicture: user.image || user?.candidate?.profile?.profilePicture as string,
    jobType: user?.candidate?.profile?.jobType as string,
  }
}

export async function getUsersSkills() {
  const session = await auth();
  const userId = session?.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      candidate: {
        select: {
          profile: {
            select: {
              skills: true
            }
          }
        }
      }
    }
  });
  if(!user || !user.candidate) return null
  return user.candidate.profile?.skills || [];
}


export async function onForgotPassword(email: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        error: true,
        message: "No account found with this email address",
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return {
      error: false,
      message: "Password reset link sent to your email",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      error: true,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function onResetPassword(token: string, newPassword: string) {
  try {
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        error: true,
        message: "Invalid or expired reset token",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      error: false,
      message: "Password has been reset successfully",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      error: true,
      message: "Something went wrong. Please try again later.",
    };
  }
} 