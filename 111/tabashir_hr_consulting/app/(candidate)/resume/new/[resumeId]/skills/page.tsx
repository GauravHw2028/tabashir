"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus } from "lucide-react"
import { useResumeStore } from "../../store/resume-store"

const skillsSchema = z.object({
  skills: z.array(z.string()).min(3, { message: "Please add at least 3 skills" }),
})

type SkillsFormValues = z.infer<typeof skillsSchema>

export default function SkillsPage({ params }: { params: { resumeId: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { setFormCompleted } = useResumeStore()

  // Initialize form with default values
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: ["Figma", "Adobe Cloud", "Team Work", "Time Management"],
    },
  })

  const onSubmit = async (data: SkillsFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to save data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Skills saved:", data)

      // Mark this form as completed
      setFormCompleted("skills")

      toast({
        title: "Success",
        description: "Your skills have been saved successfully.",
      })

      // Navigate to the next section
      router.push(`/resume/new/${params.resumeId}/languages`)
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

  const addSkill = () => {
    if (newSkill.trim() && !form.getValues().skills.includes(newSkill.trim())) {
      const currentSkills = form.getValues().skills
      form.setValue("skills", [...currentSkills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues().skills
    form.setValue(
      "skills",
      currentSkills.filter((skill) => skill !== skillToRemove),
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Skills</h2>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-700">Add Skills</FormLabel>
                <FormDescription className="text-gray-600">
                  Add skills that are relevant to the position you're applying for.
                </FormDescription>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Type a skill"
                    className="flex-1 text-gray-900 placeholder:text-gray-500 border-gray-300"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch("skills").map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#E6F0FA] text-[#0D57E1] px-3 py-1.5 rounded-md"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-[#0D57E1] hover:text-blue-700 focus:outline-none"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
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
