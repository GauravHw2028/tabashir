"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useResumeStore } from "@/app/(candidate)/resume/new/store/resume-store";
import {
  aiResumePersonalDetailsSchema,
  AiResumePersonalDetailsSchemaType,
} from "./schema";
import { AiResumePersonalDetails } from "@prisma/client";
import { onSavePersonalDetails } from "@/actions/ai-resume";
import { toast } from "sonner";
const AiResumePersonalDetailsForm = ({
  aiResumePersonalDetails,
  aiResumeId,
}: {
  aiResumePersonalDetails?: AiResumePersonalDetails;
  aiResumeId: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setFormCompleted } = useResumeStore();

  // Initialize form with default values
  const form = useForm<AiResumePersonalDetailsSchemaType>({
    resolver: zodResolver(aiResumePersonalDetailsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  // Add state for custom error handling
  const [showSocialLinksError, setShowSocialLinksError] = useState(false);

  const addSocialLink = () => {
    if (fields.length < 2) {
      append({ label: "", url: "" });
      form.clearErrors(`socialLinks.${fields.length}`);
      setShowSocialLinksError(false);
    }
  };

  const removeSocialLink = (index: number) => {
    remove(index);
    if (fields.length === 1) {
      setShowSocialLinksError(true);
    }
  };

  const onSubmit = async (data: AiResumePersonalDetailsSchemaType) => {
    if (fields.length === 0) {
      setShowSocialLinksError(true);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await onSavePersonalDetails(aiResumeId, data);
      console.log("response", response);
      if (response.error) {
        toast.error(response.message, {
          className:"bg-red-500 text-white"
        });
        return;
      }
      if (response.data) {
        console.log("Personal details saved:", response.data);

        // Mark this form as completed - use setState to ensure updates
        useResumeStore.setState((state) => ({
          completedForms: {
            ...state.completedForms,
            "personal-details": true,
          },
        }));

        toast.success(response.message);

        // Navigate to the next section
        router.push(response.redirectTo);
      }
    } catch (error) {
      toast.error("There was a problem saving your information.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                    placeholder="Enter your full name"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                    placeholder="Enter your email address"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                    placeholder="Enter your phone number"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                    placeholder="Enter your country"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                    placeholder="Enter your city"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-700">
                Social Links
              </h3>
              {fields.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSocialLink}
                  className="text-sm text-black"
                >
                  Add Social Link
                </Button>
              )}
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg relative"
              >
                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Label</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="e.g., LinkedIn, Twitter"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-gray-900 placeholder:text-gray-500 border-gray-300"
                          placeholder="https://..."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
            {showSocialLinksError && (
              <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Please add at least one social link to continue
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#042052] to-[#0D57E1] hover:opacity-90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AiResumePersonalDetailsForm;
