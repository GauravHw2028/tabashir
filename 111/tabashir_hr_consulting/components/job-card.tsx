import { Job } from "@/app/(candidate)/jobs/_components/types";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onClick: () => void;
  isSelected?: boolean;
}

export default function JobCard({ job, onClick, isSelected, }: JobCardProps) {

  return (
    <Card
      className={`bg-white rounded-lg p-4  cursor-pointer transition-all shadow-md hover:shadow-lg  ${isSelected ? "bg-[#E9F5FF]" : ""
        }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={job.logo || "/placeholder.svg"}
            alt={job.company}
            width={74}
            height={74}
            className="w-full h-full object-contain p-2"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg text-gray-900">{job.title}</h3>
              <p className="text-base text-gray-600">{job.company}</p>
            </div>

            <div className="flex items-start gap-2">
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

              <button className={cn("text-gray-400 hover:text-red-500", job.isLikded && "text-red-500")}>
                <Heart size={20} fill={job.isLikded ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.location}</span>
            </div>
            <div>{job.views} views</div>
            <div>{job.postedTime}</div>
            <div>{job.jobType}</div>
            <div>{job.applicationsCount} applied</div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                Team
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                {job.department}
              </div>
            </div>

            <div className="text-sm font-medium text-blue-500">
              {job.salary.amount}
              <span className="text-xs text-gray-500">
                {/* {job.salary && job.salary.period ? `/${job.salary.period}` : ''} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
