"use client"

import { useState, useEffect } from "react"
import { Check, CoinsIcon as Coin } from "lucide-react"
import { TermsModal } from "./_components/terms-modal"
import { ServiceModal } from "./_components/service-modal"
import { PaymentSuccessModal } from "./_components/payment-success-modal"
import { UserProfileHeader } from "../dashboard/_components/user-profile-header"
import { useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ServiceDetailsPage() {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [selectedService, setSelectedService] = useState<{
    id: string
    title: string
    price: number
    description: string
    features?: string[]
  } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successServiceId, setSuccessServiceId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem("tabashir-terms-accepted")

    if (!hasAcceptedTerms) {
      setShowTermsModal(true)
    }

    // Check for payment success
    const paymentCompleted = searchParams.get('payment_completed')
    const serviceId = searchParams.get('service_id')

    if (paymentCompleted === 'true' && serviceId) {
      setShowSuccessModal(true)
      setSuccessServiceId(serviceId)
    }
  }, [searchParams])

  const handleCloseTermsModal = () => {
    // Save to localStorage that user has accepted terms
    localStorage.setItem("tabashir-terms-accepted", "true")
    setShowTermsModal(false)
  }

  const handleServiceClick = (service: {
    id: string
    title: string
    price: number
    description: string
    features?: string[]
  }) => {
    setSelectedService(service)
  }

  return (
    <div className="flex-1 text-gray-900">
      <div className="w-full flex justify-end pb-6">
        <UserProfileHeader />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-125px)]">
        <h1 className="text-2xl font-bold mb-10">Packages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Business Plan Card */}
          <Card className="shadow-md hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Coin className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">100AED</CardTitle>
                  <CardDescription className="text-lg font-semibold">Business Plan</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Applying to 100 jobs</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>ATS Complaint CV Writing</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tailored Cover letter for each job</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                onClick={() => handleServiceClick({
                  id: "business-plan",
                  title: "Business Plan",
                  price: 10000,
                  description: "Perfect for job seekers looking to make their mark in the industry",
                  features: [
                    "Applying to 100 jobs",
                    "ATS Complaint CV Writing",
                    "Tailored Cover letter for each job"
                  ],
                })}
              >
                Get Service
              </Button>
              <p className="text-sm text-muted-foreground text-center">Plan Description</p>
            </CardFooter>
          </Card>

          {/* Pro Player Plan Card - 250AED */}
          <Card className="shadow-md hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Coin className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">250AED</CardTitle>
                  <CardDescription className="text-lg font-semibold">Pro Player Plan</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Applying to 100 jobs</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Interview Training 100 mins</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>ATS Complaint CV Writing</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tailored Cover letter for each job</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                onClick={() => handleServiceClick({
                  id: "pro-player-plan",
                  title: "Pro Player Plan",
                  price: 25000,
                  description: "Comprehensive package for serious job seekers",
                  features: [
                    "Applying to 100 jobs",
                    "Interview Training 100 mins",
                    "ATS Complaint CV Writing",
                    "Tailored Cover letter for each job"
                  ],
                })}
              >
                Get Service
              </Button>
              <p className="text-sm text-muted-foreground text-center">Plan Description</p>
            </CardFooter>
          </Card>

          {/* AI Job Apply Package - 200AED */}
          <Card className="shadow-md hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Coin className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">200AED</CardTitle>
                  <CardDescription className="text-lg font-semibold">AI Job Apply</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>AI matches your CV to the best 200 jobs from our database and applies on your behalf.</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                onClick={() => handleServiceClick({
                  id: "ai-job-apply",
                  title: "AI Job Apply",
                  price: 20000,
                  description: "Let AI find and apply to the best jobs for you",
                  features: [
                    "AI matches your CV to the best 200 jobs",
                    "Automatic job applications",
                    "Smart job matching algorithm"
                  ],
                })}
              >
                Get Service
              </Button>
              <p className="text-sm text-muted-foreground text-center">Plan Description</p>
            </CardFooter>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LinkedIn Optimization */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">LinkedIn Optimization</CardTitle>
                <CardDescription className="text-lg font-semibold">70AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Enhance your professional presence with a profile that stands out to recruiters.</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  onClick={() => handleServiceClick({
                    id: "linkedin-optimization",
                    title: "LinkedIn Optimization",
                    price: 7000,
                    description: "Enhance your professional presence with a profile that stands out to recruiters",
                  })}
                >
                  Get Service
                </Button>
              </CardFooter>
            </Card>

            {/* ATS CV */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">ATS CV</CardTitle>
                <CardDescription className="text-lg font-semibold">40AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Optimize your CV for Applicant Tracking Systems to increase your chances of getting noticed.</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  onClick={() => handleServiceClick({
                    id: "ats-cv",
                    title: "ATS CV",
                    price: 4000,
                    description: "Optimize your CV for Applicant Tracking Systems to increase your chances of getting noticed",
                  })}
                >
                  Get Service
                </Button>
              </CardFooter>
            </Card>

            {/* Interview Training */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Interview Training</CardTitle>
                <CardDescription className="text-lg font-semibold">150AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Gain confidence and skills with tailored interview preparation and strategies.</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  onClick={() => handleServiceClick({
                    id: "interview-training",
                    title: "Interview Training",
                    price: 15000,
                    description: "Gain confidence and skills with tailored interview preparation and strategies",
                  })}
                >
                  Get Service
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Service Details</h2>
          <p className="text-gray-700 mb-6 max-w-3xl">
            Unlock the power of AI to create professional, tailored resumes with ease. Whether you're a job seeker or a
            recruiter, our AI-powered resume generator is designed to help you stand out in a competitive job market.
          </p>

          <div className="space-y-4 max-w-xl">
            <div className="flex">
              <span className="font-semibold w-36">Service Type :</span>
              <span>One Time Payment</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-36">Purchasing date:</span>
              <span>25th March, 2025</span>
            </div>
          </div>
        </div>
      </div>
      <TermsModal isOpen={showTermsModal} onClose={handleCloseTermsModal} />
      {selectedService && (
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
        />
      )}
      {successServiceId && (
        <PaymentSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            setSuccessServiceId(null)
          }}
          serviceId={successServiceId}
        />
      )}
    </div>
  )
}