"use client";
/**
 * useEscrow — escrow fund and sync operations.
 *
 * Flow from context.md:
 * 1. Client clicks "Fund Escrow"
 * 2. Frontend calls POST /escrow/:job_id/fund → FastAPI returns unsigned XDR
 * 3. Frontend signs XDR with Freighter → broadcasts to Stellar Horizon
 * 4. Frontend calls PATCH /escrow/:job_id/sync → FastAPI syncs state from Trustless Work
 * 5. SWR revalidates job data to reflect FUNDED status
 */
import { useCallback, useState } from "react";
import useSWR from "swr";
import { api, fetcher } from "../lib/api";
import { signAndSubmitXdr } from "../lib/stellar";
import type { Job } from "../types/job";
import type { EscrowOnChainState } from "../types/escrow";

interface EscrowFundResponse {
  unsignedXdr: string;
}

interface SyncResponse {
  job: Job;
}

export function useEscrow(jobId: string | null) {
  const [isFunding, setIsFunding] = useState(false);
  const [fundError, setFundError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Poll on-chain state for this job's escrow (if escrowId is available)
  const { data: onChainState, mutate: refreshOnChainState } =
    useSWR<EscrowOnChainState>(
      jobId ? `/escrow/${jobId}/status` : null,
      fetcher,
      {
        refreshInterval: 15000, // poll every 15s
        revalidateOnFocus: true,
      }
    );

  /**
   * Fund the escrow for a job.
   * Returns the Stellar transaction hash on success, null on failure.
   */
  const fundEscrow = useCallback(
    async (walletAddress: string): Promise<string | null> => {
      if (!jobId || !walletAddress) return null;

      setIsFunding(true);
      setFundError(null);
      setTxHash(null);

      try {
        // Step 1: Get unsigned XDR from FastAPI
        const { unsignedXdr } = await api.post<EscrowFundResponse>(
          `/escrow/${jobId}/fund`,
          { walletAddress }
        );

        // Step 2: Sign XDR with Freighter and broadcast to Stellar
        const hash = await signAndSubmitXdr(unsignedXdr);
        setTxHash(hash);

        // Step 3: Notify FastAPI to sync on-chain state
        await api.patch<SyncResponse>(`/escrow/${jobId}/sync`, {
          stellarTxHash: hash,
        });

        // Step 4: Refresh on-chain state
        await refreshOnChainState();

        return hash;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to fund escrow.";
        setFundError(msg);
        return null;
      } finally {
        setIsFunding(false);
      }
    },
    [jobId, refreshOnChainState]
  );

  return {
    onChainState,
    isFunding,
    fundError,
    txHash,
    fundEscrow,
    refreshOnChainState,
  };
}
