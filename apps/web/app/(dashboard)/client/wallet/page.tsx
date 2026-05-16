"use client";
import React from "react";
import { useWallet } from "../../../../hooks/useWallet";

export default function ClientWalletPage() {
  const { address, isConnected, connect, disconnect, isConnecting, isNotInstalled, installUrl } = useWallet();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border-l-4 border-l-primary bg-gradient-to-r from-white to-green-50/30">
        <div>
          <h2 className="text-2xl font-bricolage font-bold text-gray-900 mb-1">Your Wallet</h2>
          <p className="text-gray-600">Connect your Freighter wallet to fund escrow smart contracts securely on the Stellar network.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 mt-6">
        {isConnected ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-check-circle-fill text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bricolage font-bold text-gray-900 mb-2">Wallet Connected</h3>
            <div className="bg-gray-50 px-6 py-4 rounded-xl inline-block mb-8 border border-gray-100">
              <p className="font-mono text-gray-700 break-all text-sm md:text-base">
                {address}
              </p>
            </div>
            <div>
              <button 
                onClick={disconnect}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : isNotInstalled ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-exclamation-triangle-fill text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bricolage font-bold text-gray-900 mb-2">Freighter Not Installed</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You need the Freighter browser extension to securely fund escrows and approve milestone payouts on the Stellar network.
            </p>
            <a 
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2 shadow-lg"
            >
              <i className="bi bi-download"></i> Install Freighter
            </a>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-wallet2 text-4xl"></i>
            </div>
            <h3 className="text-2xl font-bricolage font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Link your Freighter wallet to deploy trustless escrows and manage payments safely.
            </p>
            <button 
              onClick={connect}
              disabled={isConnecting}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg inline-flex items-center gap-2 disabled:opacity-70"
            >
              {isConnecting ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin"></i> Connecting...
                </>
              ) : (
                <>
                  <i className="bi bi-link-45deg"></i> Connect Freighter
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
