/**
 * User type — aligned with context.md and the FastAPI users table.
 */

export type UserRole = "client" | "freelancer" | "resolver";

export interface User {
  id: string;
  email: string;
  /** Full name or company name */
  fullName: string;
  role: UserRole;
  /** Freighter wallet public key — set after wallet connection, null until then */
  stellarAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Shape for user registration */
export interface UserRegister {
  email: string;
  password: string;
  fullName: string;
  role: "client" | "freelancer";
}

/** Shape for login credentials */
export interface UserLogin {
  email: string;
  password: string;
}

/** Shape for the FastAPI auth response */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
