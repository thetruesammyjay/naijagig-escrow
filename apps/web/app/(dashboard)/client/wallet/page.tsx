"use client";
import React from "react";
import { useWallet } from "../../../../hooks/useWallet";
import { useSession } from "next-auth/react";
import { shortAddress } from "../../../../lib/stellar";

export default function ClientWalletPage() {
  const { address, isConnected, connect, disconnect, isConnecting, isNotInstalled, installUrl, status } = useWallet();
  const { data: session } = useSession();
  const userName = (session?.user as any)?.name ?? "there";

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-l-4 border-l-primary bg-gradient-to-r from-white to-green-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bricolage font-bold text-gray-900 mb-1">Escrow Wallet</h2>
            <p className="text-gray-600 text-sm">
              Connect your Freighter wallet to fund trustless escrow contracts and approve milestone payments on the Stellar network.
            </p>
          </div>
          {isConnected && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold self-start sm:self-auto">
              <i className="bi bi-circle-fill text-[8px]" /> Live
            </span>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-2xl p-8">

        {/* Loading state */}
        {status === "idle" && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <i className="bi bi-wallet2 text-2xl text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Checking wallet status…</p>
          </div>
        )}

        {/* Not installed */}
        {isNotInstalled && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-exclamation-triangle-fill text-4xl" />
            </div>
            <h3 className="text-xl font-bricolage font-bold text-gray-900 mb-2">Freighter Not Detected</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              Freighter is a free Chrome extension that acts as your Stellar wallet. It lets you sign transactions securely without exposing your private key.
            </p>
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              <i className="bi bi-download" /> Install Freighter — It's Free
            </a>
            <p className="text-xs text-gray-400 mt-4">
              After installing, refresh this page and click <strong>Connect</strong>.
            </p>
          </div>
        )}

        {/* Connected */}
        {isConnected && address && (
          <div className="py-4">
            <div className="flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-2xl mb-8">
              <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <i className="bi bi-shield-check text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Connected Stellar Address</p>
                <p className="font-mono text-gray-800 text-sm break-all">{address}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1">Network</p>
                <p className="font-semibold text-gray-800">
                  <i className="bi bi-diagram-3 mr-2 text-primary" />
                  Stellar Testnet
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1">Short Address</p>
                <p className="font-mono font-semibold text-gray-800">{shortAddress(address)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={disconnect}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100"
              >
                <i className="bi bi-plug" /> Disconnect Wallet
              </button>
              <a
                href={`https://stellar.expert/explorer/testnet/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <i className="bi bi-box-arrow-up-right" /> View on Stellar Explorer
              </a>
            </div>
          </div>
        )}

        {/* Idle / disconnected but installed */}
        {(status === "error" || (status === "idle" && !isConnected && !isNotInstalled)) && (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-wallet2 text-4xl" />
            </div>
            <h3 className="text-xl font-bricolage font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
              Link your Freighter wallet to deploy Stellar escrow contracts and manage secure milestone payments.
            </p>
            <button
              onClick={connect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isConnecting ? (
                <><i className="bi bi-arrow-repeat animate-spin" /> Waiting for Freighter…</>
              ) : (
                <><i className="bi bi-link-45deg" /> Connect Freighter</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info callout */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-400 bg-blue-50/30">
        <h4 className="font-bricolage font-bold text-gray-900 mb-2 flex items-center gap-2">
          <i className="bi bi-info-circle-fill text-blue-500" /> How NaijaGig Escrow Works
        </h4>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Post a job and define your milestones with USDC amounts.</li>
          <li>Connect your Freighter wallet and fund the escrow smart contract on Stellar.</li>
          <li>Your freelancer works on each milestone and submits it for your review.</li>
          <li>You approve completed milestones — funds release automatically on-chain.</li>
          <li>Dispute a milestone if the work isn't satisfactory — funds stay locked until resolved.</li>
        </ol>
      </div>
    </div>
  );
}
