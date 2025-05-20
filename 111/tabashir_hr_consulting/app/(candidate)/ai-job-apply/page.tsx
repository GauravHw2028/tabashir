"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { UserProfileHeader } from "../dashboard/_components/user-profile-header"
import { getUserResumes } from "@/actions/resume"
import { Resume } from "@prisma/client"

// Define the form schema with Zod
const formSchema = z.object({
  resume: z
    .string()
    .nullable()
    .refine((val) => val !== null, {
      message: "Please select a resume",
    }),
  positions: z.array(z.string()).min(1, "Please add at least one preferred position"),
  locations: z.array(z.string()).min(1, "Please select at least one preferred location"),
})

type FormValues = {
  resume: string | null;
  positions: string[];
  locations: string[];
}

export default function AIJobApplyPage() {
  const [resumeList, setResumeList] = useState<Resume[]|null>(null)
  const [positionInput, setPositionInput] = useState<string>("")

  useEffect(() => {
    async function fetchResumeList() {
      const response = await getUserResumes()
      if(response.data){
        setResumeList(response.data)
      }
    }
    fetchResumeList()
  }, [])

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: null,
      positions: ["Business & Arts", "Collecting", "General"],
      locations: ["Hybrid", "Onsite"],
    },
  })

  const { setValue, watch, formState } = form
  const selectedResume = watch("resume")
  const selectedPositions = watch("positions")
  const selectedLocations = watch("locations")

  const handleRemovePosition = (position: string) => {
    const updatedPositions = selectedPositions.filter((p) => p !== position)
    setValue("positions", updatedPositions, { shouldValidate: true })
  }

  const handleLocationToggle = (location: string) => {
    let updatedLocations
    if (selectedLocations.includes(location)) {
      updatedLocations = selectedLocations.filter((l) => l !== location)
    } else {
      updatedLocations = [...selectedLocations, location]
    }
    setValue("locations", updatedLocations, { shouldValidate: true })
  }

  const handleAddPosition = () => {
    if (positionInput.trim() !== "") {
      setValue("positions", [...selectedPositions, positionInput.trim()], { shouldValidate: true })
      setPositionInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddPosition()
    }
  }

  const onSubmit = (data: FormValues) => {
    toast({
      title: "Application started",
      description: `Starting to apply with ${selectedPositions.length} positions and ${selectedLocations.length} locations`,
    })
    console.log("Form submitted:", data)
  }

  return (
    <div className="flex-1  text-gray-900 max-h-[calc(100vh-35px)] overflow-y-auto">
      <div className="w-full flex justify-end mb-4">
        <UserProfileHeader />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 h-[90%]  ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center mb-10">
              <h1 className="text-2xl font-bold">Automate your Applying Job</h1>
              <Sparkles className="ml-3 text-yellow-400 h-6 w-6" />
            </div>

            {/* Step 1: Select Resume */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-semibold">Select Your Resume</h2>
              </div>

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {resumeList && resumeList.length > 0 ? (
                          resumeList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() =>
                                setValue("resume", field.value === item.id ? null : item.id, { shouldValidate: true })
                              }
                              className={`cursor-pointer rounded-md ${
                                field.value === item.id
                                  ? "p-0" // No padding when selected to accommodate the border
                                  : "border p-4 hover:border-blue-200"
                              }`}
                            >
                              {field.value === item.id ? (
                                <div className="rounded-md p-[3px] bg-gradient-to-r from-blue-950 to-blue-700">
                                  <div className="bg-white p-4 rounded-[4px] flex">
                                    <div className="flex-shrink-0 mr-4">
                                      <div className="w-16 h-20 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">
                                        PDF
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{item.filename}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Created on: {new Date(item.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex">
                                  <div className="flex-shrink-0 mr-4">
                                    <div className="w-16 h-20 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">
                                      PDF
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.filename}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Created on: {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 text-center py-8">
                            <div className="text-gray-500 mb-2">No resumes found</div>
                            <p className="text-sm text-gray-400">Please upload a resume to get started</p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 2: Job Position */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold">Which Job Position you prefer</h2>
                <span className="text-xs text-gray-500 ml-2">min 5 and max 30</span>
              </div>

              <FormField
                control={form.control}
                name="positions"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <div className="relative mb-4">
                          <Input
                            placeholder="e.g., Personal Growth"
                            className="pr-10 border-gray-300 rounded-full"
                            value={positionInput}
                            onChange={(e) => setPositionInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-600"
                            onClick={handleAddPosition}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {selectedPositions.map((position) => (
                            <div
                              key={position}
                              className="flex items-center bg-gradient-to-r from-blue-950 to-blue-700 text-white px-3 py-1 rounded-full text-sm"
                            >
                              {position}
                              <Button
                                size="icon"
                                variant="ghost"
                                type="button"
                                className="ml-1 h-4 w-4 text-white hover:bg-transparent hover:text-white"
                                onClick={() => handleRemovePosition(position)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 3: Location */}
            <div className="mb-16">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white font-bold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold">Location you Prefer</h2>
              </div>

              <FormField
                control={form.control}
                name="locations"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-3">
                        {["Hybrid", "Onsite", "Remote"].map((location) => (
                          <Button
                            key={location}
                            type="button"
                            variant="outline"
                            className={`rounded-full px-6 ${
                              selectedLocations.includes(location)
                                ? "bg-gradient-to-r from-blue-950 to-blue-700 text-white border-transparent hover:from-blue-900 hover:to-blue-600"
                                : "bg-gray-200 text-gray-700 border-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => handleLocationToggle(location)}
                          >
                            {location}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-950 to-blue-700 hover:from-blue-900 hover:to-blue-600 text-white py-6 rounded-md text-lg font-medium border-0"
            >
              Start Applying my Application
            </Button>

            {/* Show overall form error if any */}
            {Object.keys(formState.errors).length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 font-medium">Please fix the following errors:</p>
                <ul className="list-disc pl-5 mt-1 text-red-500 text-sm">
                  {formState.errors.resume && <li>{formState.errors.resume.message}</li>}
                  {formState.errors.positions && <li>{formState.errors.positions.message}</li>}
                  {formState.errors.locations && <li>{formState.errors.locations.message}</li>}
                </ul>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}