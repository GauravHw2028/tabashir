"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2, CalendarIcon } from "lucide-react"
import { useResumeStore } from "../../store/resume-store"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const jobSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  city: z.string().min(2, { message: "City is required" }),
  startDate: z.string().min(2, { message: "Start date is required" }),
  endDate: z.string().optional(),
  isPresent: z.boolean().default(false),
  description: z.string().min(30, { message: "Description should be at least 30 characters" }),
})

const employmentHistorySchema = z.object({
  jobs: z.array(jobSchema).min(1, { message: "At least one job is required" }),
})

type EmploymentHistoryFormValues = z.infer<typeof employmentHistorySchema>

export default function EmploymentHistoryPage({ params }: { params: { resumeId: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { setFormCompleted } = useResumeStore()

  // Initialize form with default values
  const form = useForm<EmploymentHistoryFormValues>({
    resolver: zodResolver(employmentHistorySchema),
    defaultValues: {
      jobs: [
        {
          jobTitle: "Graphic Design",
          companyName: "Lardev",
          country: "USA",
          city: "New York City",
          startDate: "2023-03-07",
          endDate: "",
          isPresent: true,
          description:
            "Led the design team in creating user interfaces for web and mobile applications. Collaborated with product managers and developers to ensure design implementation met specifications.",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "jobs",
  })

  const onSubmit = async (data: EmploymentHistoryFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to save data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Employment history saved:", data)

      // Mark this form as completed
      setFormCompleted("employment-history")

      toast({
        title: "Success",
        description: "Your employment history has been saved successfully.",
      })

      // Navigate to the next section
      router.push(`/resume/new/${params.resumeId}/education`)
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

  return (
    <div className="space-y-6 rounded-[6px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Employment History</h2>
        <Button
          type="button"
          size="sm"
          className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white h-8 px-3"
          onClick={() =>
            append({
              jobTitle: "",
              companyName: "",
              country: "",
              city: "",
              startDate: "",
              endDate: "",
              isPresent: false,
              description: "",
            })
          }
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div key={field.id} className="p-6 border border-gray-200 rounded-md">
              {index > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Job {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`jobs.${index}.jobTitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="Enter job title"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.companyName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Company Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="Enter company name"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.country`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Country</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="Enter country"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.city`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="Enter city"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-700">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal text-gray-900 border-gray-300",
                                !field.value && "text-gray-500",
                              )}
                            >
                              {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700">End Date</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`present-${index}`}
                            checked={form.watch(`jobs.${index}.isPresent`)}
                            onCheckedChange={(checked) => {
                              form.setValue(`jobs.${index}.isPresent`, !!checked)
                              if (checked) {
                                form.setValue(`jobs.${index}.endDate`, "")
                              }
                            }}
                            className="border-gray-400"
                          />
                          <label htmlFor={`present-${index}`} className="text-sm text-gray-700 cursor-pointer">
                            I currently work here
                          </label>
                        </div>

                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal text-gray-900 border-gray-300",
                                  !field.value && "text-gray-500",
                                  form.watch(`jobs.${index}.isPresent`) && "opacity-50",
                                )}
                                disabled={form.watch(`jobs.${index}.isPresent`)}
                              >
                                {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                              initialFocus
                              disabled={form.watch(`jobs.${index}.isPresent`)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-gray-700">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-gray-900 resize-none border-gray-300"
                          placeholder="Describe your responsibilities and achievements"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

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
