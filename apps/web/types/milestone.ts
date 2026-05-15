/**
 * Milestone type — aligned with context.md and the FastAPI Pydantic schema.
 *
 * IMPORTANT: amount is a string. Never use JS number for USDC values.
 */

export type MilestoneStatus =
  | "PENDING"
  | "FUNDED"
  | "IN_PROGRESS"
  | "PENDING_REVIEW"
  | "SUBMITTED"
  | "APPROVED"
  | "RELEASED"
  | "DISPUTED"
  | "RESOLVED";

export interface Milestone {
  id: string;
  jobId: string;
  /** 1-indexed ordering within the job */
  sequence: number;
  title: string;
  description: string;
  /** USDC amount as a string — never parse to float */
  amount: string;
  status: MilestoneStatus;
  /** Freelancer's delivery note set on submission */
  submissionNote: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  disputedAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
}
