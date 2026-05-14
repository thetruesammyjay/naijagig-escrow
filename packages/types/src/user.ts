export type UserRole = "client" | "freelancer" | "resolver";

export interface User {
	id: string;
	email: string;
	fullName: string;
	role: UserRole;
	stellarAddress: string | null;
	createdAt: string;
	updatedAt: string;
}
