"use client";
/**
 * EscrowFundButton — triggers the full escrow funding flow.
 * Uses useEscrow() and useWallet() for real Trustless Work integration.
 */
import React from "react";
import { Button } from "../ui/button";
import { useWallet } from "../../hooks/useWallet";
import { useEscrow } from "../../hooks/useEscrow";
import { useToast } from "../ui/toast";
import { getStellarExplorerUrl } from "../../lib/stellar";

interface EscrowFundButtonProps {
  /** USDC amount as string (never number) */
  amount: string;
  jobId: string;
  /** Called after successful funding so parent can refresh job data */
  onSuccess?: (txHash: string) => void;
}

export function EscrowFundButton({
  amount,
  jobId,
  onSuccess,
}: EscrowFundButtonProps) {
  const { address, isConnected, connect, isConnecting } = useWallet();
  const { fundEscrow, isFunding } = useEscrow(jobId);
  const { toast } = useToast();

  const handleFund = async () => {
    // Guard: must have wallet connected
    if (!address || !isConnected) {
      toast.info(
        "Please connect your Freighter wallet before funding the escrow."
      );
      await connect();
      return;
    }

    toast.info("Opening Freighter for signature approval…");
    const txHash = await fundEscrow(address);

    if (txHash) {
      toast.success(
        `Escrow funded! Transaction confirmed on Stellar. Hash: ${txHash.slice(0, 8)}…`
      );
      onSuccess?.(txHash);
    } else {
      toast.error(
        "Failed to fund escrow. Please check your wallet balance and try again."
      );
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleFund}
      isLoading={isFunding || isConnecting}
      icon="bi-shield-lock"
    >
      {isFunding
        ? "Funding Escrow…"
        : `Fund ${amount} USDC to Escrow`}
    </Button>
  );
}
