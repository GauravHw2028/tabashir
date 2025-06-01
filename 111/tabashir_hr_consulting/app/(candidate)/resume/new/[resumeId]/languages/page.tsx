"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus } from "lucide-react"
import { useResumeStore } from "../../store/resume-store"

const languageSchema = z.object({
  language: z.string().min(2, { message: "Language name is required" }),
  proficiency: z.string().min(2, { message: "Proficiency level is required" }),
})

const languagesFormSchema = z.object({
  languages: z.array(languageSchema).min(1, { message: "At least one language is required" }),
})

type LanguagesFormValues = z.infer<typeof languagesFormSchema>

export default function LanguagesPage({ params }: { params: { resumeId: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { setFormCompleted } = useResumeStore()

  // Initialize form with default values
  const form = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesFormSchema),
    defaultValues: {
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Arabic", proficiency: "Intermediate" },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  })

  const onSubmit = async (data: LanguagesFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to save data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Languages saved:", data)

      // Mark this form as completed
      // setFormCompleted("languages")

      toast({
        title: "Success",
        description: "Your languages have been saved successfully.",
      })

      // Navigate to the generating page
      router.push(`/resume/new/${params.resumeId}/generating`)
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

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !form.getValues().languages.some((l) => l.language.toLowerCase() === newLanguage.toLowerCase())
    ) {
      append({ language: newLanguage.trim(), proficiency: "Intermediate" })
      setNewLanguage("")
    }
  }

  const proficiencyLevels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"]

  return (
    <div className="space-y-6 rounded-[6px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Languages</h2>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-4">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Type a language"
              className="flex-1 text-gray-900 placeholder:text-gray-500 border-gray-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addLanguage()
                }
              }}
            />
            <Button
              type="button"
              onClick={addLanguage}
              className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white"
            >
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          {fields.length > 0 && (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border border-gray-100"
                >
                  <FormField
                    control={form.control}
                    name={`languages.${index}.language`}
                    render={({ field }) => <div className="font-medium text-gray-800">{field.value}</div>}
                  />

                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name={`languages.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[140px] h-8 text-sm text-gray-800 border-gray-300">
                                <SelectValue placeholder="Select level" className="text-gray-800" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="text-gray-800">
                              {proficiencyLevels.map((level) => (
                                <SelectItem key={level} value={level} className="text-gray-800">
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Resume..." : "Create Resume"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
