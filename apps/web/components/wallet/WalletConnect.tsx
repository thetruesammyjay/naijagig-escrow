"use client";
import React from "react";
import { Button } from "../ui/button";
import { useWallet } from "../../hooks/useWallet";
import { shortAddress } from "../../lib/stellar";

export function WalletConnect() {
  const {
    address,
    isConnecting,
    isConnected,
    isNotInstalled,
    installUrl,
    connect,
    disconnect,
    error,
  } = useWallet();

  // Extension not installed — show install prompt
  if (isNotInstalled) {
    return (
      <a
        href={installUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors px-3 py-1.5 rounded-full"
        title="Freighter wallet not installed"
      >
        <i className="bi bi-wallet2" />
        Install Freighter
      </a>
    );
  }

  // Connected state
  if (address && isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-gray-500 font-semibold">Connected</span>
          <span className="text-sm font-bold text-primary bg-green-50 px-2 rounded-md font-mono">
            {shortAddress(address)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          title="Disconnect Wallet"
        >
          <i className="bi bi-box-arrow-right" />
        </Button>
      </div>
    );
  }

  // Disconnected state
  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="primary"
        size="sm"
        onClick={connect}
        isLoading={isConnecting}
        icon="bi-wallet2"
      >
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
      {error && (
        <span className="text-xs text-red-500 hidden sm:inline">{error}</span>
      )}
    </div>
  );
}
