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
import Link from "next/link"
import { useSession } from "next-auth/react"
import { paymentData } from "@/lib/payment-data"

export default function ServiceDetailsPage() {
  const session = useSession();
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [selectedService, setSelectedService] = useState<{
    id: string
    title: string
    price: number
    description: string
    features?: string[]
    link?: string
  } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successServiceId, setSuccessServiceId] = useState<string | null>(null)
  const [latestPayment, setLatestPayment] = useState<{
    amount: number
    currency: string
    formattedDate: string
  } | null>(null)
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
    link?: string
  }) => {
    setSelectedService(service)
  }

  useEffect(() => {
    // Fetch latest payment
    const fetchLatestPayment = async () => {
      try {
        if (session.data?.user?.id) {
          const response = await fetch(`/api/payments/latest?userId=${session.data?.user?.id}`)
          const data = await response.json()
          if (data.payment) {
            setLatestPayment(data.payment)
          }
          console.log(data.payment)
        }
      } catch (error) {
        console.error('Error fetching latest payment:', error)
      }
    }

    fetchLatestPayment()
  }, [session.data?.user?.id])

  return (
    <div className="flex-1 text-gray-900">
      <div className="bg-white rounded-lg shadow-sm p-8 min-h-[calc(100vh-125px)]">
        <h1 className="text-2xl font-bold mb-10">Packages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Business Plan Card */}

          {/* AI Job Apply Package */}
          <Card className="shadow-md hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <Coin className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">{paymentData.aiJobApply.price}AED</CardTitle>
                  <CardDescription className="text-lg font-semibold">{paymentData.aiJobApply.title}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{paymentData.aiJobApply.description}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full"
                style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                onClick={() => handleServiceClick({
                  ...paymentData.aiJobApply,
                  link: paymentData.aiJobApply.link
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
                <CardTitle className="text-xl">{paymentData.linkedinOptimization.title}</CardTitle>
                <CardDescription className="text-lg font-semibold">{paymentData.linkedinOptimization.price}AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{paymentData.linkedinOptimization.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  onClick={() => handleServiceClick({
                    ...paymentData.linkedinOptimization,
                    link: paymentData.linkedinOptimization.link
                  })}
                >
                  Get Service
                </Button>
              </CardFooter>
            </Card>

            {/* ATS CV */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{paymentData.cvTransformer.title}</CardTitle>
                <CardDescription className="text-lg font-semibold">{paymentData.cvTransformer.price}AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{paymentData.cvTransformer.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  asChild
                >
                  <Link href="/resume/new">
                    Get Service
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Interview Training */}
            <Card className="shadow-md hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{paymentData.interview.title}</CardTitle>
                <CardDescription className="text-lg font-semibold">{paymentData.interview.price}AED</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{paymentData.interview.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  style={{ background: "linear-gradient(91.97deg, #042052 25.05%, #0D57E1 176.12%)" }}
                  onClick={() => handleServiceClick({
                    ...paymentData.interview,
                    link: paymentData.interview.link
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

          {latestPayment ? (<div className="space-y-4 max-w-xl">
            <div className="flex">
              <span className="font-semibold w-36">Service Type :</span>
              <span>One Time Payment</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-36">Latest Purchase:</span>
              <span>{latestPayment.amount} AED</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-36">Purchasing date:</span>
              <span>{latestPayment.formattedDate}</span>
            </div>
          </div>
          ) : (
            <div className="flex">
              <span className="font-semibold w-36">Purchasing date:</span>
              <span>No purchases yet</span>
            </div>
          )}
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
      </div>
    </div>
  )
}