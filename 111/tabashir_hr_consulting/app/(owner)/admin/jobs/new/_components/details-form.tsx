"use client"

import { useState, type KeyboardEvent, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import RichTextEditor from "@/app/components/rich-text-editor"
import TiptapEditor from "@/components/tiptap-editor"

interface DetailsFormProps {
  form: UseFormReturn<any>
  onNext: () => void
  onPrev: () => void
}

export default function DetailsForm({ form, onNext, onPrev }: DetailsFormProps) {
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [benefitInput, setBenefitInput] = useState("")
  const [benefits, setBenefits] = useState<string[]>([])

  // Initialize skills and benefits from form values
  useEffect(() => {
    const formSkills = form.getValues("requiredSkills") || []
    const formBenefits = form.getValues("benefits") || []
    setSkills(formSkills)
    setBenefits(formBenefits)
  }, [form])

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (skillInput.trim() && !skills.includes(skillInput.trim())) {
        const newSkills = [...skills, skillInput.trim()]
        setSkills(newSkills)
        form.setValue("requiredSkills", newSkills)
        setSkillInput("")
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((skill) => skill !== skillToRemove)
    setSkills(newSkills)
    form.setValue("requiredSkills", newSkills)
  }

  const handleBenefitKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
        const newBenefits = [...benefits, benefitInput.trim()]
        setBenefits(newBenefits)
        form.setValue("benefits", newBenefits)
        setBenefitInput("")
      }
    }
  }

  const removeBenefit = (benefitToRemove: string) => {
    const newBenefits = benefits.filter((benefit) => benefit !== benefitToRemove)
    setBenefits(newBenefits)
    form.setValue("benefits", newBenefits)
  }

  const handleSubmit = form.handleSubmit(() => {
    onNext()
  })

  return (
    <div className="text-gray-900">
      <h2 className="text-xl font-semibold mb-6">Details</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-lg p-6 space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredSkills"
              render={() => (
                <FormItem>
                  <FormLabel>Skills Required for Job</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                   <TiptapEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                  <TiptapEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={() => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a benefit and press Enter"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyDown={handleBenefitKeyDown}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeBenefit(benefit)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>
            <Button type="submit" className="bg-blue-950 hover:blue-gradient text-white">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
