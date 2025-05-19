import { z } from "zod";

export const candidateLoginFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export type CandidateLoginFormSchemaType = z.infer<typeof candidateLoginFormSchema>