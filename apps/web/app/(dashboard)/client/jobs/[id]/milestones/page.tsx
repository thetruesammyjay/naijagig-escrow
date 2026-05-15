"use client";
/**
 * Client Job Milestones Page — dedicated view of milestone progress for a job.
 * Redirects to the job detail page which already shows milestones inline.
 */
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClientJobMilestonesPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  // Milestones are shown inline on the job detail page — redirect there
  useEffect(() => {
    router.replace(`/client/jobs/${jobId}`);
  }, [jobId, router]);

  return null;
}
