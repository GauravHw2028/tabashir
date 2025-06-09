"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Bookmark, Trash2, Loader2 } from "lucide-react";
import { UserProfileHeader } from "../dashboard/_components/user-profile-header";
import { auth } from "@/app/utils/auth";
import { toast } from "sonner";

// Type definition for applied job
interface AppliedJob {
  id: number;
  jobTitle: string;
  position: string;
  jobId: string;
  applied: string;
  company: string;
  location: string;
  status: string;
}

// Function to fetch applied jobs
async function fetchAppliedJobs(email: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/resume/applied-jobs?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch applied jobs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    throw error;
  }
}

// Function to get user session data
async function getUserSession() {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      throw new Error("Failed to get session");
    }
    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    throw error;
  }
}

export default function AppliedJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);

  // Fetch applied jobs on component mount
  useEffect(() => {
    async function loadAppliedJobs() {
      try {
        setLoading(true);
        setError(null);

        // Get user session to extract email
        const session = await getUserSession();

        if (!session?.user?.email) {
          throw new Error("No user session found");
        }

        // Fetch applied jobs
        const response = await fetchAppliedJobs(session.user.email);

        // Transform API response to match our interface
        // Adjust this transformation based on the actual API response structure
        const transformedJobs = response.data?.map((job: any, index: number) => ({
          id: job.id || index,
          jobTitle: job.jobTitle || job.job_title || job.title || "Unknown Job",
          position: job.position || job.level || "Not specified",
          jobId: job.jobId || job.job_id || `#${job.id || index}`,
          applied: job.appliedDate || job.applied_date || job.createdAt
            ? new Date(job.appliedDate || job.applied_date || job.createdAt).toLocaleDateString()
            : "Unknown",
          company: job.company || job.companyName || job.entity || "Unknown Company",
          location: job.location || job.city || job.vacancy_city || "Not specified",
          status: job.status || "Pending",
        })) || [];

        setAppliedJobs(transformedJobs);
        setTotalJobs(transformedJobs.length);
      } catch (err: any) {
        setError(err.message || "Failed to load applied jobs");
        toast.error("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    }

    loadAppliedJobs();
  }, []);

  // Filter jobs based on search query only
  const filteredJobs = appliedJobs.filter((job) => {
    return (
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-[#FFF8E6] text-[#F5A623] border-[#F5A623]";
      case "rejected":
        return "bg-[#FFEBEB] text-[#FF5252] border-[#FF5252]";
      case "viewed":
        return "bg-[#E6F4FF] text-[#2196F3] border-[#2196F3]";
      case "interview":
        return "bg-[#E6FFE6] text-[#4CAF50] border-[#4CAF50]";
      case "offers":
      case "offer":
        return "bg-[#F3E8FF] text-[#9C27B0] border-[#9C27B0]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl text-gray-900">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading applied jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl text-gray-900">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Applied Jobs</h1>
        <UserProfileHeader />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4">
          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Job Title
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Position
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Job ID
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Applied
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Company
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Location
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase text-gray-500 py-3 w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-gray-800">
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? "No jobs found matching your search criteria"
                        : "You haven't applied to any jobs yet"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs
                    .slice(0, Number.parseInt(itemsPerPage))
                    .map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          {job.jobTitle}
                        </TableCell>
                        <TableCell>{job.position}</TableCell>
                        <TableCell>{job.jobId}</TableCell>
                        <TableCell>{job.applied}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              job.status
                            )} font-normal px-3 py-1 rounded-md text-opacity-100`}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-8 w-8"
                              >
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.65 13.1651C9.75 13.2651 9.86667 13.3151 10 13.3151C10.1333 13.3151 10.25 13.2651 10.35 13.1651L13.15 10.3651C13.3167 10.1985 13.3583 10.0151 13.275 9.81514C13.1917 9.61514 13.0333 9.51514 12.8 9.51514H7.2C6.96667 9.51514 6.80833 9.61514 6.725 9.81514C6.64167 10.0151 6.68333 10.1985 6.85 10.3651L9.65 13.1651ZM10 20.5151C8.61667 20.5151 7.31667 20.2525 6.1 19.7271C4.88333 19.2018 3.825 18.4895 2.925 17.5901C2.025 16.6901 1.31267 15.6318 0.788 14.4151C0.263333 13.1985 0.000666667 11.8985 0 10.5151C0 9.1318 0.262667 7.8318 0.788 6.61514C1.31333 5.39847 2.02567 4.34014 2.925 3.44014C3.825 2.54014 4.88333 1.8278 6.1 1.30314C7.31667 0.77847 8.61667 0.515803 10 0.515137C11.3833 0.515137 12.6833 0.777803 13.9 1.30314C15.1167 1.82847 16.175 2.5408 17.075 3.44014C17.975 4.34014 18.6877 5.39847 19.213 6.61514C19.7383 7.8318 20.0007 9.1318 20 10.5151C20 11.8985 19.7373 13.1985 19.212 14.4151C18.6867 15.6318 17.9743 16.6901 17.075 17.5901C16.175 18.4901 15.1167 19.2028 13.9 19.7281C12.6833 20.2535 11.3833 20.5158 10 20.5151ZM10 18.5151C12.2167 18.5151 14.1043 17.7361 15.663 16.1781C17.2217 14.6201 18.0007 12.7325 18 10.5151C18 8.29847 17.221 6.4108 15.663 4.85214C14.105 3.29347 12.2173 2.51447 10 2.51514C7.78333 2.51514 5.89567 3.29414 4.337 4.85214C2.77833 6.41014 1.99933 8.2978 2 10.5151C2 12.7318 2.779 14.6195 4.337 16.1781C5.895 17.7368 7.78267 18.5158 10 18.5151Z"
                                    fill="#8B909A"
                                  />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Bookmark className="mr-2 h-4 w-4" />
                                <span>Bookmark</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Showing</span>
              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>of {totalJobs}</span>
            </div>

            <Pagination className="text-gray-800">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
