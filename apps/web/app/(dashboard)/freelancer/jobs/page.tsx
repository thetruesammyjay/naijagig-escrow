"use client";
/**
 * Freelancer Find Jobs Page — browse open jobs from the API.
 */
import React from "react";
import Link from "next/link";
import { useJobs } from "../../../../hooks/useJob";
import { JobCard } from "../../../../components/jobs/JobCard";
import { formatDate } from "../../../../lib/utils";

export default function FreelancerJobsPage() {
  const { jobs, isLoading, error } = useJobs();

  // Filter to only open jobs the freelancer hasn't accepted yet
  const openJobs = jobs.filter((j) => j.status === "DRAFT" || j.status === "FUNDED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bricolage font-bold text-2xl text-gray-900">
            Find Work
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Browse available jobs with escrow-secured payments.
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <i className="bi bi-arrow-repeat animate-spin text-3xl text-primary" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <i className="bi bi-exclamation-triangle text-4xl text-red-400" />
          <p className="mt-3 text-gray-600">Failed to load jobs. Please try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && openJobs.length === 0 && (
        <div className="text-center py-20 glass-card rounded-3xl">
          <i className="bi bi-briefcase text-5xl text-gray-300" />
          <h3 className="font-bricolage font-bold text-xl text-gray-700 mt-4">
            No Open Jobs Yet
          </h3>
          <p className="text-gray-500 mt-2 text-sm">
            Check back soon — new jobs are posted regularly.
          </p>
        </div>
      )}

      {/* Jobs grid */}
      {!isLoading && !error && openJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openJobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              clientName="Client"
              budget={parseFloat(job.totalAmount)}
              currency="USDC "
              status={
                job.status === "FUNDED" ? "open" : "open"
              }
              createdAt={formatDate(job.createdAt)}
              description={job.description}
              href={`/freelancer/jobs/${job.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
