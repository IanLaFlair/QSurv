"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (type: 'metamask' | 'walletconnect') => void;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Trigger animation after mount
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = 'unset';
      setVisible(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Connect Wallet</h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">Choose your preferred wallet to connect</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* MetaMask Snap Button */}
          <button 
            onClick={() => onConnect('metamask')}
            className="w-full p-4 sm:p-5 bg-gradient-to-r from-[#f6851b] to-[#e2761b] hover:from-[#e2761b] hover:to-[#d66516] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-[#f6851b]/50"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {/* MetaMask Fox SVG Icon */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.5 7.5L13.5 2L5.5 7.5L7 14L12 17L17 14L21.5 7.5Z" fill="#E17726" stroke="#E17726" strokeWidth="0.5"/>
                  <path d="M12 17L7 14L5.5 7.5L12 11.5L18.5 7.5L17 14L12 17Z" fill="#E27625"/>
                  <path d="M12 11.5L5.5 7.5L13.5 2L12 11.5Z" fill="#D7C1B3"/>
                  <path d="M12 11.5L18.5 7.5L13.5 2L12 11.5Z" fill="#E27625"/>
                  <path d="M7 14L12 17L12 22L7 14Z" fill="#F5841F"/>
                  <path d="M17 14L12 17L12 22L17 14Z" fill="#C0AD9E"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-lg font-bold">Connect MetaMask Snap</div>
                <div className="text-xs text-white/80 hidden sm:block">Recommended for desktop</div>
              </div>
            </div>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* WalletConnect Button */}
          <button 
            onClick={() => onConnect('walletconnect')}
            className="w-full p-4 sm:p-5 bg-gradient-to-r from-[#3b99fc] to-[#2b89ec] hover:from-[#2b89ec] hover:to-[#1b79dc] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-between group shadow-lg hover:shadow-[#3b99fc]/50"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {/* WalletConnect Logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <svg width="20" height="12" className="sm:w-6 sm:h-4" viewBox="0 0 300 185" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M61.439 36.256c48.91-47.888 128.212-47.888 177.123 0l5.886 5.764a6.041 6.041 0 0 1 0 8.67l-20.136 19.716a3.179 3.179 0 0 1-4.428 0l-8.101-7.931c-34.122-33.408-89.444-33.408-123.566 0l-8.675 8.494a3.179 3.179 0 0 1-4.428 0L54.978 51.253a6.041 6.041 0 0 1 0-8.67l6.461-6.327ZM280.206 77.03l17.922 17.547a6.041 6.041 0 0 1 0 8.67l-80.81 79.122c-2.446 2.394-6.41 2.394-8.856 0l-57.354-56.155a1.59 1.59 0 0 0-2.214 0L91.54 182.37c-2.446 2.394-6.411 2.394-8.857 0L1.872 103.247a6.041 6.041 0 0 1 0-8.671l17.922-17.547c2.445-2.394 6.41-2.394 8.856 0l57.355 56.155a1.59 1.59 0 0 0 2.214 0L145.57 77.03c2.446-2.394 6.41-2.395 8.856 0l57.355 56.155a1.59 1.59 0 0 0 2.214 0L271.35 77.03c2.446-2.394 6.41-2.394 8.856 0Z" fill="#3B99FC"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm sm:text-lg font-bold">WalletConnect</div>
                <div className="text-xs text-white/80 hidden sm:block">Scan with mobile wallet</div>
              </div>
            </div>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Info Section */}
          <div className="pt-2 sm:pt-4 border-t border-white/10">
            <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white">New to Qubic?</span><br/>
                  Install MetaMask Snap to connect your wallet securely to the Qubic network.
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2 text-xs text-gray-500 flex-wrap">
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
    </div>,
    document.body
  );
}
