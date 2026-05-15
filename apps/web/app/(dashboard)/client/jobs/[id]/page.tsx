"use client";
/**
 * Client Job Detail Page — shows full job info, milestone list,
 * escrow status, and lets the client fund/approve/dispute.
 */
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useJob } from "../../../../../hooks/useJob";
import { useEscrow } from "../../../../../hooks/useEscrow";
import { useMilestone } from "../../../../../hooks/useMilestone";
import { MilestoneCard } from "../../../../../components/escrow/MilestoneCard";
import { EscrowFundButton } from "../../../../../components/escrow/EscrowFundButton";
import { DisputeModal } from "../../../../../components/escrow/DisputeModal";
import { useToast } from "../../../../../components/ui/toast";
import { formatDate } from "../../../../../lib/utils";
import { ESCROW_VIEWER_URL } from "../../../../../lib/constants";
import { getStellarExplorerUrl } from "../../../../../lib/stellar";

export default function ClientJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params?.id as string;

  const { job, isLoading, error, refresh } = useJob(jobId);
  const { refreshOnChainState } = useEscrow(jobId);
  const { approveMilestone, isApproving } = useMilestone(jobId);

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeTarget, setDisputeTarget] = useState<{
    id: string;
    sequence: number;
  } | null>(null);

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
        <Link href="/client/jobs" className="mt-4 inline-block text-primary hover:underline">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const handleApprove = async (milestoneId: string) => {
    const milestone = job.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    toast.info("Opening Freighter to sign milestone approval…");
    const result = await approveMilestone(milestone.sequence);

    if (result.success) {
      toast.success("Milestone approved! Funds released on-chain.");
      await refresh();
      await refreshOnChainState();
    } else {
      toast.error(result.error ?? "Failed to approve milestone.");
    }
  };

  const handleDispute = (milestoneId: string) => {
    const milestone = job.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    setDisputeTarget({ id: milestoneId, sequence: milestone.sequence });
    setDisputeOpen(true);
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
      {/* Back link */}
      <Link
        href="/client/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <i className="bi bi-arrow-left" /> Back to My Jobs
      </Link>

      {/* Job header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
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
              Posted {formatDate(job.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Total Budget</p>
            <p className="font-bricolage font-bold text-2xl text-gray-900">
              {job.totalAmount} USDC
            </p>
          </div>
        </div>

        <p className="text-gray-600 mt-4 leading-relaxed">{job.description}</p>

        {/* Escrow contract info + Viewer links */}
        {job.escrowId && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <i className="bi bi-shield-lock-fill text-primary" />
                <span className="font-mono">
                  Escrow ID: {job.escrowId.slice(0, 16)}…
                </span>
              </div>
              {job.contractAddress && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-file-code text-gray-400" />
                  <span className="font-mono text-gray-400">
                    Contract: {job.contractAddress.slice(0, 10)}…
                  </span>
                </div>
              )}
            </div>

            {/* ── Hackathon Demo Links ── */}
            <div className="flex flex-wrap gap-2">
              {job.contractAddress && (
                <a
                  href={`${ESCROW_VIEWER_URL}/${job.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-green-500 text-white text-xs font-bold hover:from-green-700 hover:to-green-600 transition-all shadow-sm"
                >
                  <i className="bi bi-eye-fill" />
                  View Live Escrow on Trustless Work
                  <i className="bi bi-box-arrow-up-right text-[10px]" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Fund button — only shown when job is DRAFT */}
        {job.status === "DRAFT" && (
          <div className="mt-6">
            <EscrowFundButton
              amount={job.totalAmount}
              jobId={job.id}
              onSuccess={async () => {
                await refresh();
              }}
            />
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
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isClient={true}
              onApprove={handleApprove}
              onDispute={handleDispute}
            />
          ))
        )}
      </div>

      {/* Dispute Modal */}
      {disputeTarget && (
        <DisputeModal
          isOpen={disputeOpen}
          onClose={() => {
            setDisputeOpen(false);
            setDisputeTarget(null);
          }}
          jobId={jobId}
          milestoneId={disputeTarget.id}
          milestoneSequence={disputeTarget.sequence}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
