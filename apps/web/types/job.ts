/**
 * Job type — aligned with context.md and the FastAPI Pydantic schema.
 *
 * IMPORTANT: totalAmount and milestone amounts are strings, not numbers.
 * Stellar uses 7 decimal places (NUMERIC 18,7). Never use JS number for USDC.
 */

import type { Milestone } from "./milestone";

export type JobStatus =
  | "DRAFT"
  | "FUNDED"
  | "IN_PROGRESS"
  | "MILESTONE_SUBMITTED"
  | "DISPUTED"
  | "COMPLETED"
  | "RELEASED";

export interface Job {
  id: string;
  clientId: string;
  freelancerId: string | null;
  title: string;
  description: string;
  /** USDC amount as a string — never parse to float */
  totalAmount: string;
  status: JobStatus;
  /** Returned by Trustless Work on escrow init */
  escrowId: string | null;
  /** Soroban contract address on Stellar */
  contractAddress: string | null;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

/** Shape for creating a new job */
export interface JobCreate {
  title: string;
  description: string;
  totalAmount: string;
  freelancerEmail?: string;
  freelancerStellarAddress?: string;
  milestones: {
    title: string;
    description: string;
    amount: string;
  }[];
}
