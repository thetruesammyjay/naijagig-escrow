"use client";
/**
 * useWallet — Freighter wallet integration.
 *
 * Handles:
 *  - Detection of whether Freighter is installed
 *  - Requesting connection permission via setAllowed()
 *  - Reading the connected Stellar public key via getAddress()
 *  - Syncing the address to the user's profile via PATCH /users/me
 *  - Graceful handling of the extension-not-installed case
 *
 * IMPORTANT: Freighter is a browser extension. window.freighter is undefined
 * in SSR. This hook is marked "use client" and must only be used in client
 * components.
 */
import { useState, useCallback, useEffect } from "react";
import { api } from "../lib/api";

const FREIGHTER_INSTALL_URL =
  "https://www.freighter.app/";

export type WalletStatus =
  | "idle"
  | "not_installed"
  | "connecting"
  | "connected"
  | "error";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Check installation + existing connection on mount.
  // IMPORTANT: Freighter does NOT inject window.freighter.
  // The only reliable detection method is calling isConnected() from
  // @stellar/freighter-api, which communicates with the extension via
  // Chrome's internal messaging API. We give the extension 300ms to
  // initialise before querying it.
  useEffect(() => {
    const checkOnMount = async () => {
      if (typeof window === "undefined") return;

      // Small delay: extensions may not be injected synchronously on page load
      await new Promise((r) => setTimeout(r, 300));

      try {
        const { isConnected, getAddress } = await import(
          "@stellar/freighter-api"
        );

        // isConnected() returns { isConnected: boolean } when the extension IS
        // present. It throws (or returns isConnected: false) if not installed.
        const check = await isConnected();

        if (check.isConnected) {
          // Already authorised — read the address directly
          const { address: addr } = await getAddress();
          if (addr) {
            setAddress(addr);
            setStatus("connected");
            return;
          }
        }

        // Extension is present but not yet connected — leave status as idle
        // so the "Connect" button is shown.
      } catch {
        // isConnected() threw — extension is not installed or inaccessible
        setStatus("not_installed");
      }
    };

    checkOnMount();
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;

    setStatus("connecting");
    setError(null);

    try {
      const { isConnected, setAllowed, getAddress } = await import(
        "@stellar/freighter-api"
      );

      // Helper to wrap promises with a timeout
      const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
        Promise.race([
          promise,
          new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
        ]);

      // Detect Freighter by calling isConnected() from the official API.
      // This is the ONLY reliable detection method — the extension does not
      // inject any window.freighter global. If the call throws, the extension
      // is not installed.
      try {
        await withTimeout(isConnected(), 2000, { isConnected: false } as any);
        // If we reach here the extension responded — it is installed.
      } catch {
        setStatus("not_installed");
        setError("Freighter wallet extension is not installed.");
        return;
      }

      // Request permission — this shows the Freighter popup (allow up to 60s for user to click)
      const allowedRes = await Promise.race([
        setAllowed(),
        new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Connection timed out. Please try again.")), 60000))
      ]);

      // Get the public key
      const { address: addr } = await getAddress();
      if (!addr) {
        throw new Error("Could not retrieve wallet address.");
      }

      setAddress(addr);
      setStatus("connected");

      // Sync the address to the user's profile
      try {
        await api.patch("/users/me", { stellar_address: addr });
      } catch {
        // Non-fatal — address still set locally, user can retry later
        console.warn("[useWallet] Could not sync stellar address to profile");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet.";
      setError(message);
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setStatus("idle");
    setError(null);
  }, []);

  const isConnecting = status === "connecting";
  const isConnected = status === "connected";
  const isNotInstalled = status === "not_installed";

  return {
    address,
    status,
    error,
    isConnecting,
    isConnected,
    isNotInstalled,
    installUrl: FREIGHTER_INSTALL_URL,
    connect,
    disconnect,
  };
}
