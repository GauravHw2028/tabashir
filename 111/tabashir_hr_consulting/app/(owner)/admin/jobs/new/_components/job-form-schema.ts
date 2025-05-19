import * as z from "zod"

// Step 1: About form schema
export const aboutFormSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  companyDescription: z.string().min(1, "Company description is required"),
  companyLogo: z.string().url({ message: "Company logo is required" }),
  jobType: z.string().min(1, "Job type is required"),
  salaryMin: z.string().min(1, "Minimum salary is required"),
  salaryMax: z.string().min(1, "Maximum salary is required"),
})

// Step 2: Details form schema
export const detailsFormSchema = z.object({
  location: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  description: z.string().min(1, "Job description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
})

// Step 3: Application form schema
export const applicationFormSchema = z.object({
  applicationDeadline: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
})

// Complete form schema (for preview and submission)
export const jobFormSchema = z.object({
  ...aboutFormSchema.shape,
  ...detailsFormSchema.shape,
  ...applicationFormSchema.shape,
})
