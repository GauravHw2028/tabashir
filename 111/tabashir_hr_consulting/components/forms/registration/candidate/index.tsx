"use client"
import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registrationFormSchema, RegistrationFormSchemaType } from "./schema";
import { onCandidateRegistration } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter()

  const form = useForm<RegistrationFormSchemaType>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: RegistrationFormSchemaType) {
    try {
      setIsLoading(true)
      setShowSuccessMessage(false)

      const response = await onCandidateRegistration(values)

      if (response?.error) {
        return toast.error("Registration Error", {
          description: response.message,
          className: "bg-red-500 text-white",
        })
      } else {
        setShowSuccessMessage(true)
        toast.success("Registration Successful", {
          description: response.message,
        });

        // Reset form after successful registration
        form.reset()

        // Redirect after a short delay to allow user to read the message
        setTimeout(() => {
          router.push(response.redirectTo as string);
        }, 2000);
      }
    } catch (error: any) {
      console.error(error)
      toast.error("Registration Error", {
        description: error.message,
        className: "bg-red-500 text-white",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccessMessage) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
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
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Registration Successful!
          </h3>
          <p className="text-green-700 mb-4">
            We've sent a verification email to your address. Please check your inbox and click the verification link to complete your registration.
          </p>
          <p className="text-sm text-green-600">
            You'll be redirected to the login page shortly...
          </p>
        </div>

        <Button
          onClick={() => router.push("/candidate/login")}
          className="w-full bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white hover:opacity-90"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="User@gmail.com"
                  {...field}
                  className="text-gray-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Full Name"
                  {...field}
                  className="text-gray-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="text-gray-900"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#042052] to-[#0D57E1] text-white hover:opacity-90"
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
