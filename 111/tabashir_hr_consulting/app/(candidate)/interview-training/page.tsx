import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Calendar, CheckCircle, Clock, Video } from "lucide-react"
import { UserProfileHeader } from "../dashboard/_components/user-profile-header"

export default function InterviewTrainingPage() {
  return (
    <div className="container mx-auto px-4 ">
      <div className="w-full flex justify-end">
        <UserProfileHeader />
      </div>
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Interview Training</h1>
          <p className="text-xl text-gray-600">Master your interview skills with AI-powered practice sessions</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 text-white space-y-6 md:w-3/5">
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                Coming Soon
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Prepare for success with our advanced interview simulator
              </h2>
              <p className="opacity-90">
                We're building a cutting-edge platform to help you practice and perfect your interview skills with
                industry-specific questions and real-time feedback.
              </p>

              {/* Notification Form */}
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700">
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Me
                  </Button>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 p-6 md:p-0">
              <Image
                src="/interview-training.png"
                alt="Interview Training Illustration"
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
