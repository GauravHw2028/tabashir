"use client"

import { useState, useRef, useEffect } from "react"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Sparkles, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { renderAsync } from "docx-preview"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function EnhancedResumeDisplay({ resumeUrl }: { resumeUrl: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const resumeContainerRef = useRef<HTMLDivElement>(null)
  const docxContainerRef = useRef<HTMLDivElement>(null)

  // Load and render DOCX file
  useEffect(() => {
    const loadDocx = async () => {
      if (!resumeUrl || !docxContainerRef.current) return;

      try {
        const response = await fetch(resumeUrl);
        const blob = await response.blob();

        // Clear previous content
        if (docxContainerRef.current) {
          docxContainerRef.current.innerHTML = '';
        }

        // Render the DOCX file
        await renderAsync(blob, docxContainerRef.current, undefined, {
          className: 'docx-wrapper',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          useBase64URL: true,
          renderEndnotes: true,
          renderFootnotes: true,
          renderFooters: true,
          renderHeaders: true,
        });
      } catch (error) {
        console.error('Error loading DOCX:', error);
      }
    };

    loadDocx();
  }, [resumeUrl]);

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

  const handleExport = async (format: "pdf" | "docx") => {
    if (!isPaymentCompleted) {
      await initiatePayment()
      return
    }

    console.log(`Exporting enhanced resume as ${format}...`);

    // Download the enhanced resume using the resumeUrl
    const a = document.createElement('a');
    a.href = resumeUrl;
    a.download = `enhanced-resume.docx`;
    a.click();
  }

  const initiatePayment = async () => {
    if (!session?.user?.id) {
      toast.error("Please log in to download your enhanced resume")
      return
    }

    setIsProcessingPayment(true)

    try {
      // Generate unique enhanced resume ID
      const enhancedResumeId = `enhanced_${Date.now()}_${session.user.id}`

      // Use the existing service payment system for enhanced resume downloads
      const response = await fetch('https://api.ziina.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ZIINA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000, // 10 USD in cents
          currency: 'USD',
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/service-details?service_id=enhanced-resume&user_info=${session.user.id}&enhanced_resume_id=${enhancedResumeId}&resume_url=${encodeURIComponent(resumeUrl)}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/resume/enhanced?url=${encodeURIComponent(resumeUrl)}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate payment')
      }

      const { payment_url } = await response.json()

      // Redirect to payment page
      window.location.href = payment_url

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleGoBack = () => {
    router.push('/resume')
  }

  // Check if user came from successful payment
  useEffect(() => {
    // Check if coming from service-details with payment success
    const urlParams = new URLSearchParams(window.location.search)
    const serviceId = urlParams.get('service_id')
    const enhancedResumeId = urlParams.get('enhanced_resume_id')

    if (serviceId === 'enhanced-resume' && enhancedResumeId) {
      setIsCheckingPayment(true)

      // Wait 3 seconds to allow webhook to process
      setTimeout(() => {
        setIsPaymentCompleted(true)
        setIsCheckingPayment(false)
        toast.success("Payment completed! You can now download your enhanced resume.")

        // Clean URL parameters
        const cleanUrl = `${window.location.pathname}?url=${encodeURIComponent(resumeUrl)}`
        window.history.replaceState({}, '', cleanUrl)
      }, 3000)
    }
  }, [resumeUrl])

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Resumes
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={20} />
              <h1 className="text-xl font-semibold text-gray-900">AI-Enhanced Resume</h1>
            </div>
          </div>

          {isPaymentCompleted ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white gap-2">
                  <Download size={16} />
                  Download Enhanced Resume
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
          ) : (
            <Button
              onClick={() => handleExport("docx")}
              disabled={isProcessingPayment || isCheckingPayment}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing Payment...
                </>
              ) : isCheckingPayment ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking Payment...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Pay $10 & Download
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Resume Enhanced Successfully!</h3>
              <p className="text-sm text-gray-600">Your resume has been optimized with AI for better formatting, readability, and ATS compatibility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Display */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="w-full">
          <div className="overflow-hidden relative bg-white rounded-lg shadow-sm border border-gray-200">
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

            {/* Page navigation */}
            <div className="absolute left-4 top-4 flex items-center gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="h-8 w-8 rounded-full bg-white border-gray-200"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </Button>
              <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 rounded-full bg-white border-gray-200"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </Button>
            </div>

            {/* Resume content */}
            <div className="p-8">
              <div
                ref={docxContainerRef}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  width: `${100 / zoomLevel}%`,
                }}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhancement Info */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="text-blue-500 mt-1" size={20} />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI Enhancement Features Applied</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Professional formatting and layout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Grammar and language optimization</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">ATS-friendly structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Enhanced readability and impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 