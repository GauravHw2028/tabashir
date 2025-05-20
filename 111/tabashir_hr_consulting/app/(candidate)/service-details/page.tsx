"use client"

import { useState, useEffect } from "react"
import { Check, CoinsIcon as Coin } from "lucide-react"
import { TermsModal } from "./_components/terms-modal"
import { UserProfileHeader } from "../dashboard/_components/user-profile-header"
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

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem("tabashir-terms-accepted")

    if (!hasAcceptedTerms) {
      setShowTermsModal(true)
    }
  }, [])

  const handleCloseTermsModal = () => {
    // Save to localStorage that user has accepted terms
    localStorage.setItem("tabashir-terms-accepted", "true")
    setShowTermsModal(false)
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
              <Button variant="outline" className="w-full">
                Current Service
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
              >
                Get Service
              </Button>
              <p className="text-sm text-muted-foreground text-center">Plan Description</p>
            </CardFooter>
          </Card>

          {/* New 200 Job Applications Package - 200AED */}
          <Card className="shadow-md hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Coin className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">200AED</CardTitle>
                  <CardDescription className="text-lg font-semibold">200 Job Applications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Applying to 200 jobs based on your CV</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className="w-full"
                style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
              >
                Get Service
              </Button>
              <p className="text-sm text-muted-foreground text-center">Plan Description</p>
            </CardFooter>
          </Card>
        </div>

        {/* New Services Section */}
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
                <p>We help you perfect your LinkedIn profile</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
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
                <p>Upload your CV for ATS optimization</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                >
                  Get Service
                </Button>
              </CardFooter>
            </Card>

            {/* Interview Training */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Interview Training</CardTitle>
                <CardDescription className="text-lg font-semibold">100AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Prep for interviews with focus points</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
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
    </div>
  )
}