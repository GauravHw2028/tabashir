"use client"

import { useState } from "react"
import { X, MapPin, Globe, Building2, Briefcase, DollarSign, Calendar } from "lucide-react"
import type { Job } from "./types"
import Image from "next/image"
import { ApplicationModal } from "./application-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JsonToHtml } from "@/components/tiptap-editor/json-to-html"

interface JobDetailsProps {
  job: Job
  onClose: () => void
  isPreview?: boolean
}

export function JobDetails({ job, onClose, isPreview = false }: JobDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

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

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={job.company}
              width={48}
              height={48}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.company} • {job.location}, {job.country}
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
            <button
              onClick={() => setIsModalOpen(true)}
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

            <button className="w-full py-2 border border-gray-300 rounded-md font-medium flex items-center justify-center gap-2 text-gray-700">
              <Globe size={16} />
              Apply through Company Website
            </button>
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
              <p className="font-medium text-gray-900">{job.jobType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <DollarSign size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium text-gray-900">
                {Math.round(Number(job.salary.amount) / 1000)}k {job.salary.currency} / {job.salary.period}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Calendar size={20} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Posted</p>
              <p className="font-medium text-gray-900">{job.postedTime}</p>
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
                {job.description && <JsonToHtml json={JSON.parse(job.description)} />}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Requirements</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                {job.requirements && <JsonToHtml json={JSON.parse(job.requirements)} />}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Location</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">{job.jobType}</span>

                <div className="ml-4 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{job.locationDetails?.place}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Required Skills</h3>
              <div className="flex flex-wrap gap-4">
                {job.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: skill.color }}></div>
                    <span className="text-sm text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-gray-900">Benefits & Perks</h3>
              <ul className="space-y-2 text-sm">
                {job.perks?.map((perk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-700">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={job.logo || "/placeholder.svg"}
                    alt={job.company}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{job.company}</h3>
                  <p className="text-sm text-gray-600">{job.location}, {job.country}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">About the Company</h3>
                <p className="text-sm text-gray-700">
                  {/* Add company description here when available */}
                 {job.companyDescription}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">Company Culture</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Work Environment</p>
                    <p className="text-sm text-gray-600">Professional and collaborative</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Growth Opportunities</p>
                    <p className="text-sm text-gray-600">Continuous learning and development</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
