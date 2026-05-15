"use client";
/**
 * useJob — SWR-based job data fetching.
 * All mutations go through the API and revalidate SWR cache on success.
 */
import useSWR from "swr";
import { useCallback, useState } from "react";
import { api, fetcher } from "../lib/api";
import type { Job, JobCreate } from "../types/job";

/** Fetch all jobs for the current user (role-aware on the backend) */
export function useJobs() {
  const { data, error, isLoading, mutate } = useSWR<Job[]>(
    "/jobs",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    jobs: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/** Fetch a single job by ID including its milestones */
export function useJob(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Job>(
    id ? `/jobs/${id}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    job: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  };
}

/** Create a new job — calls FastAPI POST /jobs */
export function useCreateJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createJob = useCallback(
    async (payload: JobCreate): Promise<Job | null> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const job = await api.post<Job>("/jobs", payload);
        return job;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to create job.";
        setSubmitError(msg);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return { createJob, isSubmitting, submitError };
}
