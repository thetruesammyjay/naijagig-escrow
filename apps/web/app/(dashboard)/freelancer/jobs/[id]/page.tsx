"use client";
/**
 * Freelancer Job Detail Page — shows job info and lets freelancer submit milestones.
 */
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useJob, useAcceptJob } from "../../../../../hooks/useJob";
import { useMilestone } from "../../../../../hooks/useMilestone";
import { MilestoneCard } from "../../../../../components/escrow/MilestoneCard";
import { useToast } from "../../../../../components/ui/toast";
import { formatDate } from "../../../../../lib/utils";
import { ESCROW_VIEWER_URL } from "../../../../../lib/constants";

export default function FreelancerJobDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const jobId = params?.id as string;

  const { job, isLoading, error, refresh } = useJob(jobId);
  const { acceptJob, isAccepting } = useAcceptJob();
  const { submitMilestone, disputeMilestone, isSubmitting, isDisputing } =
    useMilestone(jobId);

  const [submitNote, setSubmitNote] = useState("");
  const [activeSubmit, setActiveSubmit] = useState<string | null>(null);

  const handleAcceptJob = async () => {
    const result = await acceptJob(jobId);
    if (result) {
      toast.success("Job accepted successfully! You can now start submitting milestones.");
      await refresh();
    } else {
      toast.error("Failed to accept job. It might have been taken by someone else.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <i className="bi bi-arrow-repeat animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <i className="bi bi-exclamation-triangle text-4xl text-red-400" />
        <p className="mt-4 text-gray-600">Job not found or failed to load.</p>
        <Link href="/freelancer/jobs" className="mt-4 inline-block text-primary hover:underline">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const handleSubmit = async (milestoneId: string) => {
    const milestone = job.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const result = await submitMilestone(milestone.sequence, submitNote);
    if (result.success) {
      toast.success("Milestone submitted for review!");
      setSubmitNote("");
      setActiveSubmit(null);
      await refresh();
    } else {
      toast.error(result.error ?? "Failed to submit milestone.");
    }
  };

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    FUNDED: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-yellow-50 text-yellow-700",
    MILESTONE_SUBMITTED: "bg-orange-50 text-orange-700",
    DISPUTED: "bg-red-50 text-red-700",
    RELEASED: "bg-green-50 text-green-700",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/freelancer/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
      >
        <i className="bi bi-arrow-left" /> Back to Jobs
      </Link>

      {/* Job header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-l-4 border-l-orange-500">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span
              className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
                statusColors[job.status] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {job.status.replace("_", " ")}
            </span>
            <h2 className="font-bricolage font-bold text-2xl text-gray-900">
              {job.title}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Started {formatDate(job.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Your Earnings</p>
            <p className="font-bricolage font-bold text-2xl text-gray-900">
              {job.totalAmount} USDC
            </p>
            {job.escrowId && (
              <p className="text-xs text-green-600 mt-1">
                <i className="bi bi-shield-lock-fill" /> Funded in Escrow
              </p>
            )}
            {job.contractAddress && (
              <a
                href={`${ESCROW_VIEWER_URL}/${job.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-green-700 transition-colors"
              >
                <i className="bi bi-eye-fill" />
                View Live Escrow
                <i className="bi bi-box-arrow-up-right text-[10px]" />
              </a>
            )}
          </div>
        </div>
        <p className="text-gray-600 mt-4 leading-relaxed">{job.description}</p>
        
        {!job.freelancerId && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-800">Available Job</h4>
              <p className="text-sm text-green-700">This job is open. Accept it to start working and earning.</p>
            </div>
            <button
              onClick={handleAcceptJob}
              disabled={isAccepting}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAccepting ? (
                <><i className="bi bi-arrow-repeat animate-spin" /> Accepting…</>
              ) : (
                <><i className="bi bi-check2-circle" /> Accept Job</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Milestones */}
      <div>
        <h3 className="font-bricolage font-bold text-lg text-gray-900 mb-4">
          Milestones ({job.milestones.length})
        </h3>
        {job.milestones.length === 0 ? (
          <p className="text-gray-500 text-sm">No milestones defined.</p>
        ) : (
          job.milestones.map((milestone) => (
            <div key={milestone.id}>
              <MilestoneCard
                milestone={milestone}
                isClient={false}
                onSubmit={(id) => setActiveSubmit(id)}
              />
              {/* Inline submission form */}
              {activeSubmit === milestone.id &&
                milestone.status === "PENDING" && (
                  <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
                    <p className="text-sm font-semibold text-orange-800">
                      Submit Milestone for Review
                    </p>
                    <textarea
                      rows={3}
                      value={submitNote}
                      onChange={(e) => setSubmitNote(e.target.value)}
                      placeholder="Describe what you delivered and include any relevant links..."
                      className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setActiveSubmit(null)}
                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmit(milestone.id)}
                        disabled={isSubmitting || !submitNote.trim()}
                        className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="bi bi-arrow-repeat animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <i className="bi bi-upload" /> Submit Work
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ))
        )}
        {!job.freelancerId && job.milestones.length > 0 && (
          <div className="mt-4 p-4 text-center text-gray-500 bg-gray-50 border border-gray-100 rounded-xl text-sm">
            You must accept this job to interact with milestones.
          </div>
        )}
      </div>
    </div>
  );
}
