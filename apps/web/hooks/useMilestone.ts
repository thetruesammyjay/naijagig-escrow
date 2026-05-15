"use client";
/**
 * useMilestone — milestone submit, approve, and dispute operations.
 *
 * Flows from context.md:
 *
 * Submit (freelancer):
 *   POST /escrow/:job_id/milestone/:n/submit → FastAPI calls Trustless Work
 *
 * Approve (client — releases funds on-chain):
 *   POST /escrow/:job_id/milestone/:n/approve → gets unsigned XDR
 *   → sign with Freighter → broadcast → PATCH /escrow/:job_id/sync
 *
 * Dispute (either party):
 *   POST /escrow/:job_id/milestone/:n/dispute → FastAPI calls Trustless Work
 */
import { useCallback, useState } from "react";
import { api } from "../lib/api";
import { signAndSubmitXdr } from "../lib/stellar";

interface ApproveResponse {
  unsignedXdr: string;
}

interface ActionResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export function useMilestone(jobId: string | null) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDisputing, setIsDisputing] = useState(false);

  /** Freelancer submits a milestone for review */
  const submitMilestone = useCallback(
    async (sequence: number, note: string): Promise<ActionResult> => {
      if (!jobId) return { success: false, error: "No job ID" };

      setIsSubmitting(true);
      try {
        await api.post(`/escrow/${jobId}/milestone/${sequence}/submit`, {
          note,
        });
        return { success: true };
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to submit milestone.";
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [jobId]
  );

  /**
   * Client approves a milestone — releases funds on-chain.
   * Requires Freighter wallet to sign the XDR.
   */
  const approveMilestone = useCallback(
    async (sequence: number): Promise<ActionResult> => {
      if (!jobId) return { success: false, error: "No job ID" };

      setIsApproving(true);
      try {
        // Step 1: Get unsigned XDR from FastAPI
        const { unsignedXdr } = await api.post<ApproveResponse>(
          `/escrow/${jobId}/milestone/${sequence}/approve`
        );

        // Step 2: Sign + broadcast to Stellar
        const txHash = await signAndSubmitXdr(unsignedXdr);

        // Step 3: Sync state
        await api.patch(`/escrow/${jobId}/sync`, { stellarTxHash: txHash });

        return { success: true, txHash };
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to approve milestone.";
        return { success: false, error: msg };
      } finally {
        setIsApproving(false);
      }
    },
    [jobId]
  );

  /** Either party disputes a milestone */
  const disputeMilestone = useCallback(
    async (sequence: number, reason: string): Promise<ActionResult> => {
      if (!jobId) return { success: false, error: "No job ID" };

      setIsDisputing(true);
      try {
        await api.post(`/escrow/${jobId}/milestone/${sequence}/dispute`, {
          reason,
        });
        return { success: true };
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to raise dispute.";
        return { success: false, error: msg };
      } finally {
        setIsDisputing(false);
      }
    },
    [jobId]
  );

  return {
    submitMilestone,
    approveMilestone,
    disputeMilestone,
    isSubmitting,
    isApproving,
    isDisputing,
  };
}
