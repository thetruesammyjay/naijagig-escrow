export type MilestoneStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "DISPUTED" | "RESOLVED";

export interface Milestone {
	id: string;
	jobId: string;
	sequence: number;
	title: string;
	description: string;
	amount: string;
	status: MilestoneStatus;
	submissionNote: string | null;
	submittedAt: string | null;
	approvedAt: string | null;
	disputedAt: string | null;
	resolvedAt: string | null;
	createdAt: string;
}
