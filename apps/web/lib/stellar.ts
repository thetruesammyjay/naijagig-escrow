/**
 * Stellar pure utilities — safe to import from server or client components.
 * No Stellar SDK imports here — only pure string helpers.
 */

import { APP_CONFIG, STELLAR_HORIZON_URL } from "./constants";

/** Shorten a Stellar address to 4...4 format */
export function shortAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/** Get the Stellar block explorer URL for a transaction */
export function getStellarExplorerUrl(txHash: string): string {
  const network = APP_CONFIG.stellarNetwork;
  const baseUrl =
    network === "testnet"
      ? "https://stellar.expert/explorer/testnet"
      : "https://stellar.expert/explorer/public";
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Verify a Stellar transaction was successful by checking Horizon.
 * Uses only fetch — no Stellar SDK required.
 */
export async function verifyTransaction(txHash: string): Promise<boolean> {
  try {
    const horizonUrl = STELLAR_HORIZON_URL[APP_CONFIG.stellarNetwork];
    const response = await fetch(`${horizonUrl}/transactions/${txHash}`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.successful === true;
  } catch {
    return false;
  }
}

/**
 * Sign a transaction XDR with Freighter and broadcast it to Stellar Horizon.
 * Returns the on-chain transaction hash.
 *
 * MUST only be called client-side — uses dynamic imports to keep
 * @stellar/stellar-sdk and @stellar/freighter-api out of the server bundle.
 */
export async function signAndSubmitXdr(unsignedXdr: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("signAndSubmitXdr must be called client-side only");
  }

  const network = APP_CONFIG.stellarNetwork;
  const horizonUrl = STELLAR_HORIZON_URL[network];

  // Dynamic imports keep these packages out of the server bundle entirely
  const { signTransaction } = await import("@stellar/freighter-api");
  const { Networks } = await import("@stellar/stellar-sdk");

  const networkPassphrase =
    network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;

  const { signedTxXdr } = await signTransaction(unsignedXdr, {
    networkPassphrase,
  });

  // Broadcast via Horizon REST API — no SDK needed for submission
  const horizonResponse = await fetch(`${horizonUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `tx=${encodeURIComponent(signedTxXdr)}`,
  });

  if (!horizonResponse.ok) {
    const errData = await horizonResponse.json().catch(() => ({}));
    const code =
      (errData as any)?.extras?.result_codes?.transaction ?? "UNKNOWN";
    throw new Error(`Stellar transaction failed: ${code}`);
  }

  const result = await horizonResponse.json();
  return result.hash as string;
}
