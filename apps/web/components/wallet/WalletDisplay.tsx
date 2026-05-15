"use client";
/**
 * WalletDisplay — shows connected wallet address and USDC balance.
 * Handles three states: not installed, disconnected, connected.
 */
import React from "react";
import { useWallet } from "../../hooks/useWallet";
import { shortAddress } from "../../lib/stellar";
import { Button } from "../ui/button";

export function WalletDisplay() {
  const {
    address,
    status,
    error,
    isConnecting,
    isNotInstalled,
    installUrl,
    connect,
    disconnect,
  } = useWallet();

  if (isNotInstalled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
        <i className="bi bi-wallet2 text-orange-500 text-lg" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-orange-800">
            Freighter Not Installed
          </p>
          <p className="text-xs text-orange-600">
            Install the Freighter browser extension to connect your Stellar
            wallet.
          </p>
        </div>
        <a
          href={installUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-orange-700 underline whitespace-nowrap"
        >
          Install
        </a>
      </div>
    );
  }

  if (address && status === "connected") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <i className="bi bi-wallet2 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium">
            Stellar Wallet Connected
          </p>
          <p className="text-sm font-bold text-gray-900 font-mono tracking-wide">
            {shortAddress(address)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          title="Disconnect wallet"
        >
          <i className="bi bi-box-arrow-right" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={connect}
        isLoading={isConnecting}
        icon="bi-wallet2"
        className="w-full"
      >
        {isConnecting ? "Connecting…" : "Connect Freighter Wallet"}
      </Button>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <i className="bi bi-exclamation-circle" />
          {error}
        </p>
      )}
    </div>
  );
}
