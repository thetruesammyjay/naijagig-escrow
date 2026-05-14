import type { Milestone } from "./milestone";

export type JobStatus = "DRAFT" | "FUNDED" | "IN_PROGRESS" | "MILESTONE_SUBMITTED" | "DISPUTED" | "RELEASED";

export interface Job {
	id: string;
	clientId: string;
	freelancerId: string | null;
	title: string;
	description: string;
	totalAmount: string;
	status: JobStatus;
	escrowId: string | null;
	contractAddress: string | null;
	milestones: Milestone[];
	createdAt: string;
	updatedAt: string;
}
