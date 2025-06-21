import { Job } from "@/app/(candidate)/jobs/_components/types";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { getIsLiked, onLikeJob, onUnlikeJob } from "@/actions/job";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getJobEntity } from "@/app/(candidate)/jobs/_components/job-details";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  isSelected?: boolean;
}

export default function JobCard({ job, onClick, isSelected, }: JobCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(true)
    const result = await onLikeJob(job.id)
    if (!result.success) {
      toast.error(result.error)
      setIsLiked(false)
    }
  }

  const handleUnlike = async () => {
    setIsLiked(false)
    const result = await onUnlikeJob(job.id)
    if (!result.success) {
      toast.error(result.error)
      setIsLiked(true)
    }
  }

  useEffect(() => {
    const checkIsLiked = async () => {
      const result = await getIsLiked(job.id)
      setIsLiked(result)
    }
    checkIsLiked()
  }, [job.id])
  return (
    <Card
      className={`bg-white rounded-lg p-3 sm:p-4 cursor-pointer transition-all shadow-md hover:shadow-lg ${isSelected ? "bg-[#E9F5FF]" : ""
        }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Mobile: Image and title row */}
        <div className="flex gap-3 sm:contents">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={job.logo || "/placeholder.svg"}
              alt={job.company}
              width={74}
              height={74}
              className="w-full h-full object-contain p-1 sm:p-2"
            />
          </div>

          <div className="flex-1 sm:hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <h3 className="font-medium text-base text-gray-900 line-clamp-2">{job.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{job.description?.slice(0, 100)}...</p>
              </div>
              <div className="flex items-start gap-1 flex-shrink-0">
                {job.match && (
                  <div
                    className={`px-2 py-1 rounded-full text-xs text-white ${job.match.type === "top"
                      ? "bg-orange-500"
                      : job.match.type === "best"
                        ? "bg-blue-500"
                        : "bg-pink-500"
                      }`}
                  >
                    {job.match.type === "top"
                      ? "Top"
                      : job.match.type === "best"
                        ? "Best"
                        : `${job.match.value}%`}
                  </div>
                )}
                <button
                  className={cn("text-gray-400 hover:text-red-500 p-1", isLiked && "text-red-500")}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLiked) {
                      handleUnlike()
                    } else {
                      handleLike()
                    }
                  }}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="flex-1 hidden sm:block">
          <div className="flex justify-between">
            <div className="flex-1 pr-4">
              <h3 className="font-medium text-lg text-gray-900">{job.title}</h3>
              <p className="text-base text-gray-600 line-clamp-2">{job.description?.slice(0, 130)}...</p>
            </div>

            <div className="flex items-start gap-2 flex-shrink-0">
              {job.match && (
                <div
                  className={`px-3 py-1 rounded-full text-xs text-white ${job.match.type === "top"
                    ? "bg-orange-500"
                    : job.match.type === "best"
                      ? "bg-blue-500"
                      : "bg-pink-500"
                    }`}
                >
                  {job.match.type === "top"
                    ? "Top Match"
                    : job.match.type === "best"
                      ? "Best For You"
                      : `${job.match.value}% Match`}
                </div>
              )}

              <button
                className={cn("text-gray-400 hover:text-red-500", isLiked && "text-red-500")}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isLiked) {
                    handleUnlike()
                  } else {
                    handleLike()
                  }
                }}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job details - responsive layout */}
      <div className="mt-3 space-y-3">
        {/* Location and basic info */}
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{job.location}</span>
          </div>
          <div>{job.postedTime}</div>
        </div>

        {/* Mobile: Additional details */}
        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-x-3 gap-y-1 sm:hidden">
          <div>{job.jobType}</div>
        </div>

        {/* Tags and salary */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Image src={getJobEntity(job.entity) === "Government" ? "/government_image.png" : "/private_image.png"} width={15} height={15} className="w-[15px] h-[15px]" alt="government" />
              <span className="text-sm font-medium text-gray-500">{getJobEntity(job.entity)}</span>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
              {job.department}
            </div>
          </div>

          <div className="text-sm font-medium text-blue-500 flex justify-between sm:justify-end items-center">
            <span>
              {job.salary.amount}
              <span className="text-xs text-gray-500 ml-1">
                {/* {job.salary && job.salary.period ? `/${job.salary.period}` : ''} */}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
