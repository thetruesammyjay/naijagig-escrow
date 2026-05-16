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

  // Check if already connected on mount (persists across page navigations)
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window === "undefined") return;

      try {
        const { isConnected, getAddress } = await import(
          "@stellar/freighter-api"
        );
        const check = await isConnected();
        if (check.isConnected) {
          const { address: addr } = await getAddress();
          if (addr) {
            setAddress(addr);
            setStatus("connected");
          }
        }
      } catch {
        // Freighter not installed or blocked — silently ignore on mount
      }
    };

    checkExistingConnection();
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

      // Check if the extension is installed (with timeout in case it hangs)
      const installCheck = await withTimeout(isConnected(), 6000, { isConnected: false }).catch(() => ({ isConnected: false }));
      if (!installCheck.isConnected) {
        setStatus("not_installed");
        setError("Freighter wallet extension is not installed.");
        return;
      }

      // Request permission — this shows the Freighter popup (allow up to 60s for user to click)
      const allowed = await Promise.race([
        setAllowed(),
        new Promise<boolean>((_, reject) => setTimeout(() => reject(new Error("Connection timed out. Please try again.")), 60000))
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
