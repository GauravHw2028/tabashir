"use client"

import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { jobFormSchema } from "./job-form-schema"

interface AboutFormProps {
  form: UseFormReturn<z.infer<typeof jobFormSchema>>
  onNext: () => void
}

export default function AboutForm({ form, onNext }: AboutFormProps) {
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>("")
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url")

  const handleSubmit = form.handleSubmit(() => {
    onNext()
  }, (err) => {
    console.error(err)
    const fields = ["jobTitle",
      "company",
      "companyLogo",
      "jobType",
      "salaryMin",
      "salaryMax",
      "nationality",
      "gender",]

    // Check if there are any errors in fields not in our list
    const hasOtherErrors = Object.keys(err).some(key => !fields.includes(key))

    // If there are no errors in our specified fields, proceed to next step
    if (hasOtherErrors) {
      onNext()
    }
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">About</h2>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-lg p-6 space-y-6">
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TABASHIR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your company..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <div className="space-y-4">
                    <RadioGroup
                      defaultValue="url"
                      onValueChange={(value) => setUploadMethod(value as "url" | "file")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="url" />
                        <label htmlFor="url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Paste URL
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="file" />
                        <label htmlFor="file" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Upload File
                        </label>
                      </div>
                    </RadioGroup>

                    {uploadMethod === "url" ? (
                      <FormControl>
                        <Input
                          placeholder="Paste company logo URL"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setCompanyLogoUrl(e.target.value)
                          }}
                        />
                      </FormControl>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {companyLogoUrl ? (
                            <Image
                              src={companyLogoUrl}
                              alt="Company logo"
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res?.[0]) {
                                setCompanyLogoUrl(res[0].url)
                                form.setValue("companyLogo", res[0].url)
                              }
                            }}
                            onUploadError={(error: Error) => {
                              console.error("Error uploading company logo:", error)
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender Requirements</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender requirement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality Requirements</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. UAE National, Any, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="salaryMin"
                render={() => (
                  <FormItem>
                    <FormLabel>Salary per year</FormLabel>
                    <div className="flex items-center gap-2 mt-2">
                      <FormField
                        control={form.control}
                        name="salaryMin"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                                <Input className="pl-12" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="text-gray-500">-</span>
                      <FormField
                        control={form.control}
                        name="salaryMax"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                                <Input className="pl-12" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div>{/* Placeholder for alignment */}</div>
            <Button type="submit" className="bg-blue-950 hover:blue-gradient text-white">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
