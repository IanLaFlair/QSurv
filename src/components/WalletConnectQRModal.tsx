"use client";

import { X, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface WalletConnectQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  wcUri: string | null;
  isConnecting: boolean;
}

export default function WalletConnectQRModal({ 
  isOpen, 
  onClose, 
  wcUri, 
  isConnecting 
}: WalletConnectQRModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset copied state when modal closes
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUri = () => {
    if (wcUri) {
      navigator.clipboard.writeText(wcUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeepLink = () => {
    if (wcUri) {
      // Open Qubic Wallet app with deep link
      window.location.href = `qubic-wallet://wc?uri=${encodeURIComponent(wcUri)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#3b99fc]/10 to-[#2b89ec]/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#3b99fc]/20">
                <Smartphone className="w-6 h-6 text-[#3b99fc]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Scan with Wallet</h2>
                <p className="text-sm text-gray-400">WalletConnect</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isConnecting && !wcUri ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-400">Initializing connection...</p>
            </div>
          ) : wcUri ? (
            /* QR Code Display */
            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG 
                    value={wcUri} 
                    size={280}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-white">
                  Scan QR code with your Qubic Wallet app
                </p>
                <p className="text-xs text-gray-500">
                  Open your mobile wallet and scan this code to connect
                </p>
              </div>

              {/* Mobile Deep Link Button */}
              <button
                onClick={handleDeepLink}
                className="w-full p-4 bg-gradient-to-r from-[#3b99fc] to-[#2b89ec] hover:from-[#2b89ec] hover:to-[#1b79dc] text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                Open in Qubic Wallet
              </button>

              {/* Copy URI Button */}
              <button
                onClick={handleCopyUri}
                className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Connection URI
                  </>
                )}
              </button>

              {/* Info */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">Waiting for approval</span><br/>
                    Please approve the connection request in your mobile wallet app.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-gray-400 text-center">Failed to generate connection URI</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
