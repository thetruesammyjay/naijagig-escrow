import type { JobStatus } from "./job";
import type { MilestoneStatus } from "./milestone";

export type EscrowEventType = "FUNDED" | "APPROVED" | "DISPUTED" | "RESOLVED" | "RELEASED";

export interface EscrowEvent {
	id: string;
	jobId: string;
	milestoneId: string | null;
	eventType: EscrowEventType;
	stellarTxHash: string | null;
	payload: Record<string, unknown> | null;
	createdAt: string;
}

export interface EscrowMilestoneSnapshot {
	sequence: number;
	status: MilestoneStatus;
	releasedAmount: string;
}

export interface EscrowSnapshot {
	jobId: string;
	escrowId: string;
	contractAddress: string;
	status: JobStatus;
	totalReleasedAmount: string;
	milestones: EscrowMilestoneSnapshot[];
	lastSyncedAt: string | null;
}
