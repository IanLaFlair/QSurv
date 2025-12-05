"use client";

import { X, Shield, Smartphone, Key, FileJson } from "lucide-react";

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1a1b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center text-black font-bold text-xs">Q</div>
            <span className="text-xl font-medium text-white">qubic <span className="text-primary">connect</span></span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="text-center text-lg font-medium text-white mb-6">Connect Wallet</h3>

          <button 
            onClick={() => onConnect('metamask')}
            className="w-full py-4 bg-[#f6851b] hover:bg-[#e2761b] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 group"
          >
            {/* MetaMask Fox Icon Placeholder */}
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <Shield className="w-4 h-4 text-white" />
            </div>
            Connect MetaMask Snap
          </button>

          <button 
            onClick={() => onConnect('walletconnect')}
            className="w-full py-4 bg-[#3b99fc] hover:bg-[#2b89ec] text-white font-bold rounded-xl transition flex items-center justify-center gap-3 group"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            WalletConnect
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1a1b1e] px-4 text-xs text-gray-500 uppercase tracking-wider">Manual / Unsafe</span>
            </div>
          </div>

          <div className="space-y-3 opacity-50 pointer-events-none">
             <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[10px] text-yellow-500 text-center leading-tight">
                Private Seed and Vault File options are disabled on the default mainnet RPC for security.
             </div>

             <button className="w-full py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl flex items-center justify-center gap-2">
                <Key className="w-4 h-4" /> Private Seed
             </button>
             <button className="w-full py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl flex items-center justify-center gap-2">
                <FileJson className="w-4 h-4" /> Vault File
             </button>
          </div>

          <div className="pt-2 text-center">
            <button className="text-xs text-primary hover:underline">Server Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
}
