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

const professionalSummarySchema = z.object({
  summary: z.string().min(50, { message: "Professional summary should be at least 50 characters." }),
})

type ProfessionalSummaryFormValues = z.infer<typeof professionalSummarySchema>

type PageParams = {
  resumeId: string
}

export default function ProfessionalSummaryPage({ params }: { params: Promise<PageParams> }) {
  const { resumeId } = React.use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { setFormCompleted } = useResumeStore()

  // Initialize form with default values
  const form = useForm<ProfessionalSummaryFormValues>({
    resolver: zodResolver(professionalSummarySchema),
    defaultValues: {
      summary:
        "Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end development principles. Passionate about designing user-centered interfaces that enhance engagement and usability. Strong ability to conduct user research, create wireframes, and develop interactive prototypes.",
    },
  })

  const onSubmit = async (data: ProfessionalSummaryFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to save data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Professional summary saved:", data)

      // Mark this form as completed
      setFormCompleted("professional-summary")

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
                <FormLabel className="text-gray-700">Professional Summary</FormLabel>
                <FormDescription className="text-gray-600">
                  Write 2-4 short, energetic sentences about your professional experience, skills, and achievements.
                </FormDescription>
                <FormControl>
                  <Textarea {...field} className="min-h-[200px] text-gray-900 resize-none border-gray-300" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 border-[#002B6B] text-[#002B6B]"
            onClick={generateSummary}
          >
            <Sparkles size={16} className="text-yellow-500" />
            Get help with writing
          </Button>

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
