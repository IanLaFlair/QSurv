"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { Wallet, LogOut, Copy, Check, ChevronDown } from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";

export default function WalletConnectButton() {
  const { connect, disconnect, isConnected, address, balance } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConnect = async (type: 'metamask' | 'walletconnect') => {
    // In the future, we can pass the 'type' to the connect function
    await connect();
    setShowConnectModal(false);
  };

  if (!isConnected) {
    return (
      <>
        <button 
          onClick={() => setShowConnectModal(true)}
          className="px-5 py-2 bg-[var(--primary)] text-[var(--background)] font-bold rounded-full hover:opacity-90 transition flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
        <ConnectWalletModal 
          isOpen={showConnectModal} 
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnect}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-4 pr-2 py-1.5 transition"
      >
        <div className="text-right hidden sm:block mr-2">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Balance</div>
          <div className="font-mono text-primary text-sm font-bold">{balance.toLocaleString()} QUs</div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00f0ff] flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-[#00f0ff]/20">
            {address?.slice(0, 2)}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-gray-400">Connected Wallet</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Qubic Testnet</span>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/5 group relative">
              <div className="text-xs text-gray-500 mb-1">Address</div>
              <div className="font-mono text-sm text-white break-all leading-tight pr-6">
                {address}
              </div>
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-primary text-gray-300 hover:text-black rounded-md transition"
                title="Copy Address"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <button 
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-bold">Wallet Address Copied</span>
        </div>
      )}
    </div>
  );
}
