"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [agreed, setAgreed] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">TABASHIR</h2>

          <div className="prose prose-sm max-w-none mb-6">
            <p>
              By accessing or using [Your Company Name]&apos;s website, app, or related services (&quot;Services&quot;),
              you agree to comply with and be bound by these Terms and Conditions. We reserve the right to update or
              modify these Terms at any time without prior notice, and your continued use of the Services constitutes
              acceptance of those changes. You must be at least 18 years old or have parental consent to use our
              Services. You are responsible for maintaining the confidentiality of your account and for all activities
              under it. All content provided is owned by [Your Company Name] and protected by intellectual property
              laws. You may not misuse our Services or interfere with their operation. The Services are provided
              &quot;as is&quot; without warranties, and [Your Company Name] is not liable for any damages resulting from
              your use. We may include third-party links, which we do not control or endorse. These Terms are governed
              by the laws of [Your Country/State], and any disputes will be handled in the courts of that jurisdiction.
              We reserve the right to suspend or terminate your access at any time. For questions, contact us at
              [your-email@yourcompany.com].
            </p>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree on all terms and condition
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} disabled={!agreed} className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
