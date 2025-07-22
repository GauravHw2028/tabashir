'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ResumePayment({
  resumeId,
  isOpened,
  successUrl
}: {
  resumeId: string,
  isOpened: boolean,
  successUrl?: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const session = useSession()

  async function handlePay() {
    setLoading(true)
    try {
      // Get the CV transformer service link from payment data
      const { paymentData } = await import('@/lib/payment-data')
      const cvService = paymentData.cvTransformer

      if (cvService?.link) {
        // Redirect directly to Stripe checkout link
        window.location.href = cvService.link
      } else {
        throw new Error('No checkout link available for CV service')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setLoading(false)
      // You can add toast notification here
    }
  }

  if (!isOpened) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Payment Required</h2>
        <p className="text-gray-600 mb-6">
          You have to pay 40 AED in order to create your ATS CV.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/resume')}
            disabled={loading}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go Back to Dashboard
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay with Stripe'}
          </button>
        </div>
      </div>
    </div>
  )
}
