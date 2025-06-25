"use client"

import { useState, useEffect } from "react"
import { X, Globe, Building2, Briefcase, DollarSign, Calendar, Loader2, User, Mail, Contact } from "lucide-react"
import type { Job } from "./types"
import Image from "next/image"
import { ApplicationModal } from "./application-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserResumes } from "@/actions/resume"
import { Resume } from "@prisma/client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

interface JobDetailsProps {
  job: Job
  onClose: () => void
  isPreview?: boolean
  jobApplyCount?: number
  onJobApplied?: () => void
  userId: string
}

export function JobDetails({ job, onClose, isPreview = false, jobApplyCount = 0, onJobApplied, userId }: JobDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [resumeList, setResumeList] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const session = useSession()

  // Fetch user resumes when component mounts
  useEffect(() => {
    async function fetchResumes() {
      const response = await getUserResumes()
      if (response.data) {
        setResumeList(response.data)
      }
    }
    if (!isPreview) {
      fetchResumes()
    }
  }, [isPreview])

  const handleEasyApply = () => {
    if (jobApplyCount <= 1) {
      toast.error("You need more than one job apply count to use Easy Apply")
      return
    }
    setShowResumeModal(true)
  }

  const handleApplyWithResume = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume")
      return
    }

    setIsApplying(true)
    try {
      // Fetch the file as a Blob
      const fileResponse = await fetch(selectedResume.originalUrl)
      if (!fileResponse.ok) {
        throw new Error("Failed to fetch resume file")
      }
      const fileBlob = await fileResponse.blob()
      const file = new File([fileBlob], selectedResume.filename, { type: fileBlob.type })

      // Prepare form data
      const formData = new FormData()
      formData.append("email", session.data?.user?.email || "")
      formData.append("user_id", userId || "")
      formData.append("file", file)
      formData.append("job_id", job.id)

      // Make API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/${job.id}/apply`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to apply for job")
      }

      // Success
      setShowResumeModal(false)
      setShowSuccessModal(true)
      toast.success("Successfully applied for the job!")

      // Call the callback to refresh the page
      if (onJobApplied) {
        onJobApplied()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to apply for job")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="p-6">
      {/* Application Modal - Only show if not in preview mode */}
      {!isPreview && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobTitle={job.title}
          companyName={job.company}
        />
      )}

      {/* Resume Selection Modal */}
      <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Resume to Apply</DialogTitle>
            <DialogDescription>
              Choose which resume you'd like to use for applying to {job.title} at {job.company}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {resumeList.map((resume) => (
              <div
                key={resume.id}
                onClick={() => setSelectedResume(resume)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedResume?.id === resume.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm truncate">{resume.filename}</h3>
                  {selectedResume?.id === resume.id && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Resume Preview</span>
                </div>
              </div>
            ))}
          </div>

          {resumeList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No resumes found. Please upload a resume first.
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResumeModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApplyWithResume}
              disabled={!selectedResume || isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Application Submitted Successfully!</DialogTitle>
            <DialogDescription>
              Your application for {job.title} at {job.company} has been submitted successfully.
              You will receive notifications about the status of your application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={getJobEntity(job.entity) === "Government" ? "/government_image.png" : "/private_image.png"}
              alt={job.company ? job.company + ' logo' : 'Company logo'}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.company === "Nan" ? "Private" : job.company}
              {job.location === "Nan" ? ' • Not Specified' : ` • ${job.location}`}
            </p>
          </div>
        </div>

        {!isPreview && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {!isPreview && (
          <div className="flex flex-col gap-2">
            {jobApplyCount > 1 && (
              <button
                onClick={handleEasyApply}
                className="w-full py-2 bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white rounded-md font-medium flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 10V3L4 14H11V21L20 10H13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Easy Apply via TABASHIR
              </button>
            )}

            {job.applyUrl && (
              <button onClick={() => window.open(job.applyUrl, '_blank')} className="w-full py-2 border border-gray-300 rounded-md font-medium flex items-center justify-center gap-2 text-gray-700">
                <Globe size={16} />
                Apply through Company Website
              </button>
            )}
            {job.email && (
              <div className="w-full py-2 border border-gray-300 rounded-md font-medium flex items-center justify-center gap-2 text-gray-700">
                <Mail size={16} />
                {job.email}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Building2 size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium text-gray-900">{job.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Briefcase size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium text-gray-900">{job.jobType || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <DollarSign size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">
                {job.salary.amount ? job.salary.amount : "TBD"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Calendar size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Posted</p>
              <p className="font-medium text-gray-900">{job.postedTime || "-"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <User size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-900">
                {job.gender === "Male" ? "For Male" : job.gender === "Female" ? "For Female" : "For all"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Contact size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Entity</p>
              <p className="font-medium text-gray-900">
                {getJobEntity(job.entity || "")}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6 mt-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-900">Job Description</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {/* Removing all the links https or http from description */}
                {job.description ? job.description.replace(/https?:\/\/[^\s]+/g, '') : <span className="text-gray-400">No description provided.</span>}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Nationality</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {job.nationality || "No nationality required"}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Experience</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {job.experience || "No experience required"}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Requirements</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {job.requirements ? job.requirements : <span className="text-gray-400">No requirements provided.</span>}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Department</h3>
              <div className="text-sm text-gray-700">{job.department || "-"}</div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Team</h3>
              <div className="text-sm text-gray-700">{job.team || "-"}</div>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={job.logo || "/placeholder.svg"}
                    alt={job.company ? job.company + ' logo' : 'Company logo'}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{job.company}</h3>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">About the Company</h3>
                <p className="text-sm text-gray-700">
                  {/* Removing all the links https or http from companyDescription */}
                  {job.companyDescription ? job.companyDescription.replace(/https?:\/\/[^\s]+/g, '') : <span className="text-gray-400">No company description provided.</span>}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


export function getJobEntity(entity: string | null) {
  if (!entity) return "Private"
  if (entity.toLowerCase().includes("government") || entity.toLowerCase().includes("govt") || entity.toLowerCase().includes("gov") || entity.toLowerCase().includes("governmental")) {
    return "Government"
  } else if (entity.toLowerCase().includes("semi-government") || entity.toLowerCase().includes("semi-govt") || entity.toLowerCase().includes("semi-gov") || entity.toLowerCase().includes("semi governmental")) {
    return "Semi-Government"
  } else {
    return "Private"
  }
}