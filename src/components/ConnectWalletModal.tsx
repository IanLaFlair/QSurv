"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (type: 'metamask' | 'walletconnect') => void;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  if (!isOpen) return null;

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
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">Choose your preferred wallet to connect</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* MetaMask Snap Button */}
          <button 
            onClick={() => onConnect('metamask')}
            className="w-full p-5 bg-gradient-to-r from-[#f6851b] to-[#e2761b] hover:from-[#e2761b] hover:to-[#d66516] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-[#f6851b]/50"
          >
            <div className="flex items-center gap-4">
              {/* MetaMask Fox SVG Icon */}
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5 7.5L13.5 2L5.5 7.5L7 14L12 17L17 14L21.5 7.5Z" fill="#E17726" stroke="#E17726" strokeWidth="0.5"/>
                  <path d="M12 17L7 14L5.5 7.5L12 11.5L18.5 7.5L17 14L12 17Z" fill="#E27625"/>
                  <path d="M12 11.5L5.5 7.5L13.5 2L12 11.5Z" fill="#D7C1B3"/>
                  <path d="M12 11.5L18.5 7.5L13.5 2L12 11.5Z" fill="#E27625"/>
                  <path d="M7 14L12 17L12 22L7 14Z" fill="#F5841F"/>
                  <path d="M17 14L12 17L12 22L17 14Z" fill="#C0AD9E"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Connect MetaMask Snap</div>
                <div className="text-xs text-white/80">Recommended for desktop</div>
              </div>
            </div>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* WalletConnect Button */}
          <button 
            onClick={() => onConnect('walletconnect')}
            className="w-full p-5 bg-gradient-to-r from-[#3b99fc] to-[#2b89ec] hover:from-[#2b89ec] hover:to-[#1b79dc] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-[#3b99fc]/50"
          >
            <div className="flex items-center gap-4">
              {/* WalletConnect SVG Icon */}
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 8C10.5376 5.33579 15.4624 5.33579 18.5 8L19 8.5C19.1 8.6 19.1 8.8 19 8.9L17.7 10.2C17.65 10.25 17.55 10.25 17.5 10.2L16.8 9.5C14.7 7.6 11.3 7.6 9.2 9.5L8.4 10.3C8.35 10.35 8.25 10.35 8.2 10.3L6.9 9C6.8 8.9 6.8 8.7 6.9 8.6L7.5 8ZM21.4 10.7L22.5 11.8C22.6 11.9 22.6 12.1 22.5 12.2L17.3 17.4C17.2 17.5 17 17.5 16.9 17.4L12.5 13C12.475 12.975 12.425 12.975 12.4 13L8 17.4C7.9 17.5 7.7 17.5 7.6 17.4L2.4 12.2C2.3 12.1 2.3 11.9 2.4 11.8L3.5 10.7C3.6 10.6 3.8 10.6 3.9 10.7L8.3 15.1C8.325 15.125 8.375 15.125 8.4 15.1L12.8 10.7C12.9 10.6 13.1 10.6 13.2 10.7L17.6 15.1C17.625 15.125 17.675 15.125 17.7 15.1L22.1 10.7C22.2 10.6 22.4 10.6 22.5 10.7H21.4Z" fill="#3B99FC"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">WalletConnect</div>
                <div className="text-xs text-white/80">Scan with mobile wallet</div>
              </div>
            </div>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Info Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white">New to Qubic?</span><br/>
                  Install MetaMask Snap to connect your wallet securely to the Qubic network.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
            <a href="https://metamask.io/snaps/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
              About Snaps
            </a>
            <span>•</span>
            <a href="https://walletconnect.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
              About WalletConnect
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
