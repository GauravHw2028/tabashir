"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText } from "lucide-react"
import { useResumeStore } from "../../store/resume-store"

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH_PX = 794 // 210mm at 96 DPI
const A4_HEIGHT_PX = 1123 // 297mm at 96 DPI

export default function DownloadPage({ params }: { params: { resumeId: string } }) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [editorMode, setEditorMode] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const resumeContainerRef = useRef<HTMLDivElement>(null)

  const { setPaymentCompleted, isPaymentCompleted, setSidebarVisibility, getResumeScore } = useResumeStore()

  // Initialize isPaid from store
  useEffect(() => {
    setIsPaid(isPaymentCompleted)
    setEditorMode(!isPaymentCompleted)
  }, [isPaymentCompleted])

  // Control sidebar visibility based on editor mode
  useEffect(() => {
    setSidebarVisibility(editorMode)

    // Cleanup function to restore sidebar when leaving the page
    return () => {
      setSidebarVisibility(true)
    }
  }, [editorMode, setSidebarVisibility])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleEditorModeToggle = (checked: boolean) => {
    if (!checked && !isPaid) {
      // Show payment modal when trying to turn off editor mode
      setShowPaymentModal(true)
    } else {
      setEditorMode(checked)
    }
  }

  const handleExport = (format: "pdf" | "docx") => {
    // In a real implementation, this would trigger the resume download
    console.log(`Exporting resume as ${format}...`)
  }

  const handlePayment = () => {
    setPaymentProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false)
      setPaymentSuccess(true)
      // After successful payment, close modal and turn off editor mode
      setTimeout(() => {
        setShowPaymentModal(false)
        setEditorMode(false)
        setIsPaid(true)
        // Update payment status in store
        setPaymentCompleted(true)
      }, 1500)
    }, 2000)
  }

  return (
    <div className="w-full min-h-screen">
        <div className="flex justify-end items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Editor Mode</span>
            <Switch checked={editorMode} onCheckedChange={handleEditorModeToggle} />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-[#002B6B] hover:bg-[#042052] text-gray-50 gap-2" disabled={!isPaid && editorMode}>
                Export As <ChevronRight size={16} className="ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="flex flex-col">
                <button
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <FileText size={16} />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExport("docx")}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <FileText size={16} />
                  <span>Word Document</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      <div className="max-w-6xl mx-auto px-4 py-6 rounded-[6px]">
        {/* Header with Controls */}

        {/* Resume Preview */}
        <div className="w-full">
          {/* Resume Preview */}
          <div className={` overflow-hidden relative`}>
            {/* Zoom controls */}
            <div className="absolute right-4 top-4 flex gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8 rounded-full bg-white border-gray-200"
              >
                <ZoomOut size={16} className="text-gray-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8 rounded-full bg-white border-gray-200"
              >
                <ZoomIn size={16} className="text-gray-700" />
              </Button>
            </div>

            <div
              ref={resumeContainerRef}
              className="max-h-[calc(100vh-250px)] overflow-auto"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
                padding: "2rem",
              }}
            >
              {/* Resume Content */}
              <div
                className={`max-w-[${A4_WIDTH_PX}px] mx-auto ${editorMode && !isPaid ? "blur-[2px]" : ""}`}
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  margin: "0 auto",
                }}
              >
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">Sami Haider</h1>

                <div className="flex justify-center items-center gap-3 text-sm text-gray-600 mb-8">
                  <span>New York City, USA</span>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>Samihaider@gmail.com</span>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>+01-799-2233</span>
                  <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>sami/linkedin.com</span>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3 text-gray-900">
                    Professional Summary
                  </h2>
                  <p className="text-sm text-gray-700">
                    Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end
                    development principles. Passionate about designing user-centered interfaces that enhance engagement
                    and usability. Strong ability to conduct user research, create wireframes, and develop interactive
                    prototypes. Proven experience in delivering intuitive digital experiences for e-commerce and SaaS
                    platforms.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3 text-gray-900">
                    Professional Experience
                  </h2>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900">CEO & Founder</h3>
                    <p className="text-sm text-gray-700">
                      Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end
                      development principles. Passionate about designing user-centered interfaces that enhance
                      engagement and usability. Strong ability to conduct user research, create wireframes, and develop
                      interactive prototypes. Proven experience in delivering intuitive digital experiences for
                      e-commerce and SaaS platforms.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900">CEO & Founder</h3>
                    <p className="text-sm text-gray-700">
                      Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end
                      development principles. Passionate about designing user-centered interfaces that enhance
                      engagement and usability. Strong ability to conduct user research, create wireframes, and develop
                      interactive prototypes. Proven experience in delivering intuitive digital experiences for
                      e-commerce and SaaS platforms.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900">CEO & Founder</h3>
                    <p className="text-sm text-gray-700">
                      Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end
                      development principles. Passionate about designing user-centered interfaces that enhance
                      engagement and usability. Strong ability to conduct user research, create wireframes, and develop
                      interactive prototypes. Proven experience in delivering intuitive digital experiences for
                      e-commerce and SaaS platforms.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">CEO & Founder</h3>
                    <p className="text-sm text-gray-700">
                      Creative and detail-oriented UI/UX Designer with expertise in Figma, Adobe XD, and front-end
                      development principles. Passionate about designing user-centered interfaces that enhance
                      engagement and usability. Strong ability to conduct user research, create wireframes, and develop
                      interactive prototypes. Proven experience in delivering intuitive digital experiences for
                      e-commerce and SaaS platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 py-4 bg-white border-t border-gray-200">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </Button>

              <div className="text-sm text-gray-700">
                {currentPage}/{totalPages}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-full"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </Button>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mt-6">
          <Button
            className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-gray-50 gap-2 px-6"
            onClick={() => handleExport("pdf")}
            disabled={!isPaid && editorMode}
          >
            <Download size={18} />
            Download Resume
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Unlock Full Resume View</DialogTitle>
            <DialogDescription className="text-gray-600">
              To view and download your resume without blur, please complete the payment.
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Payment Successful!</h3>
              <p className="text-gray-600 text-center">Your resume is now unlocked.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Resume Unlock Fee:</span>
                  <span className="font-bold text-gray-900">40 AED</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-gray-700">
                    Card Number
                  </Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="text-gray-900" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-gray-700">
                      Expiry Date
                    </Label>
                    <Input id="expiry" placeholder="MM/YY" className="text-gray-900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-gray-700">
                      CVC
                    </Label>
                    <Input id="cvc" placeholder="123" className="text-gray-900" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Cardholder Name
                  </Label>
                  <Input id="name" placeholder="John Doe" className="text-gray-900" />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="text-gray-700">
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  className="bg-[#002B6B] hover:bg-[#042052] text-gray-50"
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-50"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Pay 40 AED
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
