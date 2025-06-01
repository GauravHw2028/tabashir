"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles } from "lucide-react"
import { useResumeStore } from "../../store/resume-store"
import { AiProfessionalDetails } from "@prisma/client"
import { onSaveProfessionalSummary } from "@/actions/ai-resume"

const professionalSummarySchema = z.object({
  summary: z.string().min(50, { message: "Professional summary should be at least 50 characters." }),
})

type ProfessionalSummaryFormValues = z.infer<typeof professionalSummarySchema>

type PageParams = {
  aiResumeProfessionalSummary: AiProfessionalDetails | null
  resumeId: string
}

export default function ProfessionalSummaryForm({ resumeId, aiResumeProfessionalSummary }: PageParams) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { setNormalResumeScore } = useResumeStore()

  // Initialize form with default values
  const form = useForm<ProfessionalSummaryFormValues>({
    resolver: zodResolver(professionalSummarySchema),
    defaultValues: {
      summary: aiResumeProfessionalSummary?.summary || "",
    },
  })

  const onSubmit = async (data: ProfessionalSummaryFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to save data
      const result = await onSaveProfessionalSummary(resumeId, data)

      if (result.error) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })

        setIsSubmitting(false)
        return
      }

      console.log("Professional summary saved:", data)

      // Mark this form as completed
      setNormalResumeScore(24);

      toast({
        title: "Success",
        description: "Your professional summary has been saved successfully.",
      })

      // Navigate to the next section
      router.push(`/resume/new/${resumeId}/employment-history`)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your information.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSummary = async () => {
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    form.setValue(
      "summary",
      "Innovative UI/UX Designer with 5+ years of experience creating intuitive digital experiences for e-commerce and SaaS platforms. Proficient in Figma, Adobe XD, and front-end development. Demonstrated success in increasing user engagement by 35% through user-centered design approaches. Passionate about combining aesthetic appeal with functional simplicity to deliver exceptional user experiences.",
    )
  }

  return (
    <div className="space-y-6 rounded-[6px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Summary</h2>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormDescription className="text-gray-600">
                  <div className="flex items-center justify-between">
                    <p>Write 2-4 short, energetic sentences about your professional experience, skills, and achievements.</p>
                    <button
                      type="button"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white px-6 py-1 text-[13px] rounded-full"
                      onClick={generateSummary}
                    >
                      <Sparkles size={16} className="text-yellow-500" />
                      Get help with writing
                    </button>
                  </div>
                </FormDescription>
                <FormControl>
                  <Textarea {...field} className="min-h-[200px] text-gray-900 resize-none border-gray-300 bg-[#EBF4FE]" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
