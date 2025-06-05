"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Sparkles, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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
  nationality: z.array(z.string()).min(1, "Please select at least one nationality"),
  gender: z.string().min(1, "Please select a gender"),
})

type FormValues = {
  resume: string | null;
  positions: string[];
  locations: string[];
  nationality: string[];
  gender: string;
}

const NATIONALITIES = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE",
  // Add more as needed
]

const GENDERS = ["Male", "Female", "Other"]

const JOB_POSITIONS = [
  "Web Designer",
  "Product Manager",
  "UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  // Add more as needed
]

export default function AIJobApplyPage() {
  const [resumeList, setResumeList] = useState<Resume[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchResumeList() {
      const response = await getUserResumes()
      if (response.data) {
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
      nationality: [],
      gender: "",
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

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      // Find the selected resume object
      const selectedResumeObj = resumeList?.find(r => r.id === data.resume)
      if (!selectedResumeObj) {
        toast({
          title: "Resume not found",
          description: "Please select a valid resume.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Fetch the file as a Blob (using originalUrl)
      let file
      try {
        const fileResponse = await fetch(selectedResumeObj.originalUrl)
        if (!fileResponse.ok) {
          throw new Error("Failed to fetch resume file.")
        }
        const fileBlob = await fileResponse.blob()
        file = new File([fileBlob], selectedResumeObj.filename, { type: fileBlob.type })
      } catch (fetchErr: any) {
        toast({
          title: "File Fetch Error",
          description: fetchErr.message || "Could not fetch the resume file.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append("user_id", selectedResumeObj.candidateId || "")
      formData.append("file", file)
      formData.append("gender", data.gender)
      data.nationality.forEach(nat => formData.append("nationality", nat))
      data.locations.forEach(loc => formData.append("locations", loc))
      data.positions.forEach(pos => formData.append("positions", pos))

      let res
      try {
        res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/apply`, {
          method: "POST",
          body: formData,
        })
      } catch (networkErr: any) {
        toast({
          title: "Network Error",
          description: networkErr.message || "Could not reach the server.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (!res.ok) {
        let errorMsg = "Failed to apply. Please try again."
        try {
          const errorData = await res.json()
          if (errorData?.message) errorMsg = errorData.message
        } catch { }
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Application submitted!",
        description: "Your application has been sent successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
                              className={`cursor-pointer rounded-md ${field.value === item.id
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

            {/* Step 2: Job Position (Multi-select dropdown) */}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} positions selected`
                              : "Select positions..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search positions..." />
                            <CommandEmpty>No positions found.</CommandEmpty>
                            <CommandGroup>
                              {JOB_POSITIONS.map((position) => (
                                <CommandItem
                                  key={position}
                                  onSelect={() => {
                                    const updatedPositions = field.value.includes(position)
                                      ? field.value.filter((p) => p !== position)
                                      : [...field.value, position]
                                    field.onChange(updatedPositions)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(position) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {position}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((position) => (
                        <div
                          key={position}
                          className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {position}
                          <button
                            type="button"
                            onClick={() => handleRemovePosition(position)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
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
                            className={`rounded-full px-6 ${selectedLocations.includes(location)
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

            {/* Step 4: Nationality (Multi-select dropdown) */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white font-bold mr-3">
                  4
                </div>
                <h2 className="text-xl font-semibold">Nationality</h2>
              </div>
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} nationalities selected`
                              : "Select nationalities..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search nationalities..." />
                            <CommandEmpty>No nationalities found.</CommandEmpty>
                            <CommandGroup>
                              {NATIONALITIES.map((nat) => (
                                <CommandItem
                                  key={nat}
                                  onSelect={() => {
                                    const updatedNationalities = field.value.includes(nat)
                                      ? field.value.filter((n) => n !== nat)
                                      : [...field.value, nat]
                                    field.onChange(updatedNationalities)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value.includes(nat) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {nat}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((nat) => (
                        <div
                          key={nat}
                          className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {nat}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedNationalities = field.value.filter((n) => n !== nat)
                              field.onChange(updatedNationalities)
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />
            </div>

            {/* Step 5: Gender (Single-select dropdown) */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-950 to-blue-700 text-white font-bold mr-3">
                  5
                </div>
                <h2 className="text-xl font-semibold">Gender</h2>
              </div>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value || "Select gender..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search gender..." />
                            <CommandEmpty>No gender found.</CommandEmpty>
                            <CommandGroup>
                              {GENDERS.map((gender) => (
                                <CommandItem
                                  key={gender}
                                  onSelect={() => field.onChange(gender)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === gender ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {gender}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Submitting...
                </span>
              ) : (
                "Start Applying my Application"
              )}
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