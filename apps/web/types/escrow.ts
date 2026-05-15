/**
 * Escrow event type — aligned with the escrow_events DB table in context.md.
 *
 * IMPORTANT: All amounts are strings. Never use JS number for USDC values.
 */

export type EscrowEventType =
  | "FUNDED"
  | "APPROVED"
  | "DISPUTED"
  | "RESOLVED"
  | "RELEASED";

export interface EscrowEvent {
  id: string;
  jobId: string;
  /** null for job-level events */
  milestoneId: string | null;
  eventType: EscrowEventType;
  /** On-chain Stellar transaction hash */
  stellarTxHash: string | null;
  /** Raw Trustless Work webhook payload */
  payload: Record<string, unknown> | null;
  createdAt: string;
}

/** On-chain escrow state returned by Trustless Work GET /escrow/:escrowId */
export interface EscrowOnChainState {
  escrowId: string;
  contractAddress: string;
  status: string;
  totalAmount: string;
  milestones: {
    sequence: number;
    status: string;
    releasedAmount: string;
  }[];
}
