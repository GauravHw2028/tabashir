import { z } from "zod";

export const registrationFormSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
  })
  
export type RegistrationFormSchemaType = z.infer<typeof registrationFormSchema>