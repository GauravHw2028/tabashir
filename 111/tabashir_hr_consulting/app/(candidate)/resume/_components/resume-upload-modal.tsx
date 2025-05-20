'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { onUploadResume } from '@/actions/resume'
import OpenAI from 'openai'

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (newResume: { id: string; filename: string; createdAt: Date; formatedUrl: string | null; originalUrl: string; formatedContent: string | null }) => void
}

export function ResumeUploadModal({ isOpen, onClose, onUploadSuccess }: ResumeUploadModalProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await handleFileUpload(file)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFileUpload(file)
  }

  const processCVWithAI = async (cvText: string): Promise<string> => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true, // For client-side use (not secure for production)
    })

    const prompt = `
You are a CV transformation assistant. Process the following CV text into a professional format, maintaining sections like Career Objective, Education, Work Experience, Leadership Experience, Projects, Skills, and Languages. Ensure Work, Leadership, and Projects sections have 3-5 bullet points each. Enhance with relevant keywords and correct grammar/spelling.

Return the result as a JSON string with these fields:
- header: { name: string, email: string, phone: string, location: string, linkedin?: string, github?: string }
- objective: { objective: string }
- education: [{ university: string, location: string, date: string, major: string, degree: string, gpa: string, coursework: string[], details: string[] }]
- work: [{ company: string, position: string, date: string, location: string, details: string[] }]
- projects: [{ title: string, position: string, date: string, location: string, details: string[] }]
- lship: [{ company: string, position: string, date: string, location: string, details: string[] }]
- skills: { softskills: string[], skillset: string[], training: string[] }
- languages: { langs: string[] }
- keywords: string[]
If a section is empty, use null or empty arrays.`

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: cvText },
        ],
      })
      return response.choices[0].message.content || '{}'
    } catch (error) {
      throw new Error(AI processing failed: ${error instanceof Error ? error.message : String(error)})
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true)
      setUploadStatus('idle')
      setErrorMessage('')

      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        if (!text) {
          setUploadStatus('error')
          setErrorMessage('Failed to read file')
          setIsLoading(false)
          return
        }

        try {
          const formatedContent = await processCVWithAI(text)

          const uploadResult = await onUploadResume(file)

          if (uploadResult.error || !uploadResult.newResume) {
            setUploadStatus('error')
            setErrorMessage(uploadResult.message || 'Upload failed')
            setIsLoading(false)
            return
          }

          const processedResume = {
            ...uploadResult.newResume,
            formatedContent,
            formatedUrl: null,
          }

          setUploadStatus('success')
          onUploadSuccess(processedResume)

          setTimeout(() => {
            setUploadStatus('idle')
            onClose()
          }, 1000)
        } catch (error) {
          setUploadStatus('error')
          setErrorMessage(error instanceof Error ? error.message : 'Processing failed')
          setIsLoading(false)
        }
      }
      reader.onerror = () => {
        setUploadStatus('error')
        setErrorMessage('Error reading file')
        setIsLoading(false)
      }
      reader.readAsText(file)
    } catch (error) {
      setUploadStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  const handleCreateWithAI = () => {
    onClose()
    router.push('/resume/new')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1 text-gray-900">Upload Your Resume</h2>
          <p className="text-sm text-gray-600 mb-6">Help recruiter know about you</p>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
            />
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Upload className="text-gray-500" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-4">Drag and drop or click to upload</p>
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-lg z-10">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-700">Processing your resume...</p>
              </div>
            )}
            {uploadStatus === 'success' && (
              <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center rounded-lg z-10">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-green-700">Resume processed successfully!</p>
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center rounded-lg z-10">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>
          <div className="flex items-center mb-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          <button
            onClick={handleCreateWithAI}
            className="w-full py-3 bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90"
          >
            <Sparkles size={16} className="text-yellow-300" />
            Create new using AI
          </button>
        </div>
      </div>
    </div>
  )
}