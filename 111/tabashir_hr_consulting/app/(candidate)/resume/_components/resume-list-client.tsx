"use client"

import { useState, useEffect } from "react"
import { Plus, Download, Trash2, FileText, Loader2, Sparkles, Upload } from "lucide-react"
import { ResumeUploadModal } from "./resume-upload-modal"
import { AiEnhanceUploadModal } from "./ai-enhance-upload-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { toast } from "sonner"
import { deleteResume, downloadResume } from "@/actions/resume"
import { uploadCVFile } from "@/actions/ai-resume"
import { UserProfileHeader } from "../../dashboard/_components/user-profile-header"

interface Resume {
  id: string
  filename: string
  createdAt: Date
  formatedUrl: string | null
  originalUrl: string
  formatedContent: string | null
}

interface AiResume {
  id: string
  formatedUrl: string | null
  createdAt: Date
}

interface ResumeListClientProps {
  initialResumes: Resume[]
}

export function ResumeListClient({
  initialResumes,
}: ResumeListClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAiEnhanceModalOpen, setIsAiEnhanceModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [resumes, setResumes] = useState<Resume[]>(initialResumes)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingResumeId, setDownloadingResumeId] = useState<string | null>(null)

  const handleAiEnhance = () => {
    setIsAiEnhanceModalOpen(true)
  }

  // Note: Initial data is fetched on the server, no need for useEffect fetch here
  // If you need real-time updates, you might consider alternative approaches like polling or websockets.

  const handleUploadSuccess = (newResume: Resume) => {
    // Add the new resume to the list and sort by creation date (most recent first)
    setResumes(prevResumes => [newResume, ...prevResumes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const handleDelete = async () => {
    if (!selectedResume) return

    try {
      // setIsLoading(true) // Optional: Add loading state for delete button if needed
      const result = await deleteResume(selectedResume.id)
      if (result.error) {
        toast.error(result.message)
        return
      }
      toast.success("Resume deleted successfully")
      // Optimistically remove the deleted resume from the list
      setResumes(resumes.filter((r) => r.id !== selectedResume.id))
    } catch (error) {
      toast.error("Failed to delete resume")
    } finally {
      // setIsLoading(false)
      setIsDeleteModalOpen(false)
      setSelectedResume(null)
    }
  }

  const handleDownload = async (resume: Resume) => {
    if (downloadingResumeId === resume.id) return; // Prevent multiple clicks

    setDownloadingResumeId(resume.id);
    try {
      const result = await downloadResume(resume.id)
      if (result.error) {
        toast.error(result.message)
        return
      }

      if (result.data?.url && result.data?.filename) {
        // Fetch the file content as a Blob
        const response = await fetch(result.data.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const blob = await response.blob();

        // Create a File object from the blob
        const file = new File([blob], result.data.filename, { type: 'application/pdf' });

        // Upload the file to the database
        const uploadResult = await uploadCVFile(file, resume.id);
        if (uploadResult.error) {
          toast.error(uploadResult.message);
          return;
        }

        // Create a temporary URL for the blob
        const blobUrl = URL.createObjectURL(blob);

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary URL after a short delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(link);
        }, 100);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download resume")
    } finally {
      setDownloadingResumeId(null);
    }
  }

  return (
    <div className="bg-white rounded-lg px-6 min-h-[calc(100vh-35px)] py-10">
      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onAiEnhance={handleAiEnhance}
      />

      {/* AI Enhance Upload Modal */}
      <AiEnhanceUploadModal
        isOpen={isAiEnhanceModalOpen}
        onClose={() => setIsAiEnhanceModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedResume(null)
        }}
        onConfirm={handleDelete}
        title="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
      />
      <div className="flex justify-between items-center mb-8 max-lg:flex-col max-lg:gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Resume</h1>
        <div className="flex flex-wrap gap-3 justify-end max-lg:justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white py-2 px-4 rounded-md flex items-center gap-2 hover:opacity-90"
          >
            <Plus size={20} />
            <span>New Resume</span>
          </button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resumes Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Upload your first resume to get started. We'll help you optimize it for better job opportunities.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white py-2 px-6 rounded-md flex items-center gap-2 hover:opacity-90"
            >
              <Plus size={20} />
              <span>New Resume</span>
            </button>
            <button
              onClick={() => setIsAiEnhanceModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-md flex items-center gap-2 hover:opacity-90"
            >
              <Sparkles size={20} />
              <span>Upload & Enhance</span>
            </button>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDelete={() => {
                setSelectedResume(resume)
                setIsDeleteModalOpen(true)
              }}
              onDownload={() => handleDownload(resume)}
              isDownloading={downloadingResumeId === resume.id}
            />
          ))}

        </div>
      )}
    </div>
  )
}

interface ResumeCardProps {
  resume: Resume
  onDelete: () => void
  onDownload: () => void
  isDownloading: boolean
}

function ResumeCard({ resume, onDelete, onDownload, isDownloading }: ResumeCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">
          PDF
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">{resume.filename.split(".")[0].slice(0, 15) + (resume.filename.split(".")[0].length > 15 ? "..." : "") + resume.filename.split(".")[1]}</h3>
          <p className="text-xs text-gray-500">
            Created on: {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onDownload}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Download"
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-gray-500 hover:text-red-500"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

interface AiResumeCardProps {
  resume: AiResume
  onDelete: () => void
  onDownload: () => void
  isDownloading: boolean
}