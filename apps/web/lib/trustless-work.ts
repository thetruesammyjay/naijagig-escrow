/**
 * Trustless Work utilities — helpers for generating escrow deposit links.
 * The real escrow flow goes through the FastAPI backend which calls the
 * Trustless Work API directly. These helpers are for client-side info display.
 */
import { APP_CONFIG, STELLAR_HORIZON_URL, TRUSTLESS_WORK_BASE_URL } from "./constants";

export interface TrustlessWorkInitialization {
  title: string;
  description: string;
  /** USDC amount as string — never float */
  amount: string;
  assetCode: "XLM" | "USDC";
  receiverAddress: string;
}

export class TrustlessWorkService {
  /**
   * Generates a payment link for manual escrow funding reference.
   * The real XDR-based flow goes through useEscrow() / the FastAPI backend.
   */
  static generateEscrowDepositLink(
    params: TrustlessWorkInitialization
  ): string {
    const network = APP_CONFIG.stellarNetwork;
    const baseUrl = TRUSTLESS_WORK_BASE_URL[network];
    const searchParams = new URLSearchParams({
      amount: params.amount,
      asset: params.assetCode,
      destination: params.receiverAddress,
      memo: "NaijaGig_Escrow_Fund",
      network: network === "testnet" ? "testnet" : "public",
    });

    return `${baseUrl}/pay?${searchParams.toString()}`;
  }

  /**
   * Verify an escrow transaction via Stellar Horizon.
   * Delegates to lib/stellar.ts verifyTransaction() for consistency.
   */
  static async verifyEscrowTransaction(txHash: string): Promise<boolean> {
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
}
