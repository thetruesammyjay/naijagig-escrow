/**
 * App-wide constants — aligned with context.md.
 * All enum values match the DB schema (SCREAMING_SNAKE_CASE).
 */

export const APP_CONFIG = {
  name: "NaijaGig Escrow",
  description: "Secure escrow platform for Nigerian freelancers and clients.",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  stellarNetwork: (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as
    | "testnet"
    | "mainnet",
} as const;

/** Horizon RPC URL keyed by network */
export const STELLAR_HORIZON_URL = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

/** USDC asset issuer addresses on each network */
export const USDC_ASSET = {
  testnet: {
    code: "USDC",
    issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
  },
  mainnet: {
    code: "USDC",
    issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
  },
} as const;

/** Trustless Work API base URL keyed by network */
export const TRUSTLESS_WORK_BASE_URL = {
  testnet:
    process.env.NEXT_PUBLIC_TRUSTLESS_WORK_BASE_URL ||
    "https://dev.api.trustlesswork.com",
  mainnet: "https://api.trustlesswork.com",
} as const;

/**
 * Trustless Work Escrow Viewer — shows live on-chain escrow state.
 * Judges at the hackathon demo look for this. Link to it from every job page.
 * Usage: `${ESCROW_VIEWER_URL}/${contractAddress}`
 */
export const ESCROW_VIEWER_URL = "https://viewer.trustlesswork.com";

/** Job statuses — must match the DB CHECK constraint exactly */
export const JOB_STATUS = {
  DRAFT: "DRAFT",
  FUNDED: "FUNDED",
  IN_PROGRESS: "IN_PROGRESS",
  MILESTONE_SUBMITTED: "MILESTONE_SUBMITTED",
  DISPUTED: "DISPUTED",
  RELEASED: "RELEASED",
} as const;

/** Milestone statuses — must match the DB CHECK constraint exactly */
export const MILESTONE_STATUS = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  DISPUTED: "DISPUTED",
  RESOLVED: "RESOLVED",
} as const;

/** Terminal job states — no further mutations allowed */
export const TERMINAL_JOB_STATUSES = [
  JOB_STATUS.RELEASED,
] as const;

/** Escrow event types */
export const ESCROW_EVENT_TYPE = {
  FUNDED: "FUNDED",
  APPROVED: "APPROVED",
  DISPUTED: "DISPUTED",
  RESOLVED: "RESOLVED",
  RELEASED: "RELEASED",
} as const;
