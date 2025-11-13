import type React from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "../utils/auth"
import { onGetUserProfile } from "@/actions/auth";
import CandidateLayout from "./candidate-layout";

type RequestHeaders = Awaited<ReturnType<typeof headers>>;

export default async function CandidateLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  if (!session?.user) {
    const headersList = await headers();
    const loginRedirectTarget = getRedirectTarget(headersList);
    const loginUrl = loginRedirectTarget
      ? `/candidate/login?redirect=${encodeURIComponent(loginRedirectTarget)}`
      : "/candidate/login";
    redirect(loginUrl);
  }
  const candidate = await onGetUserProfile();
  if (!candidate) {
    redirect(`/candidate/${session?.user.id}/personal-info`)
  }
  return (
    <CandidateLayout session={session}>
      {children}
    </CandidateLayout>
  )
}

function getRedirectTarget(headersList: RequestHeaders) {
  const headerCandidates = [
    "x-url",
    "x-next-url",
    "x-invoke-path",
    "x-pathname",
    "x-forwarded-uri",
    "x-original-uri",
    "referer",
  ];

  for (const headerName of headerCandidates) {
    const value = headersList.get(headerName);
    if (value) {
      const normalized = normalizeRedirectPath(value);
      if (normalized && normalized !== "/candidate/login") {
        console.log(`Found redirect target from header ${headerName}:`, normalized);
        return normalized;
      }
    }
  }

  const forwardedProto = headersList.get("x-forwarded-proto");
  const forwardedHost = headersList.get("x-forwarded-host");
  const forwardedUri = headersList.get("x-forwarded-uri") || headersList.get("x-original-uri");

  if (forwardedProto && forwardedHost && forwardedUri) {
    const normalized = normalizeRedirectPath(`${forwardedProto}://${forwardedHost}${forwardedUri}`);
    if (normalized && normalized !== "/candidate/login") {
      console.log("Found redirect target from forwarded headers:", normalized);
      return normalized;
    }
  }

  // Don't default to dashboard - return null so we don't add redirect parameter
  // This way, if no path is found, the login form will use the default redirectTo from onLogin
  console.log("No redirect target found in headers, returning null");
  return null;
}

function normalizeRedirectPath(value: string | null) {
  if (!value) return null;

  try {
    const url = value.startsWith("http://") || value.startsWith("https://")
      ? new URL(value)
      : new URL(value, "http://localhost");

    const pathWithQuery = `${url.pathname}${url.search}`;
    return pathWithQuery || "/";
  } catch {
    if (value.startsWith("/")) {
      return value;
    }

    return `/${value}`;
  }
}
