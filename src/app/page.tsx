"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, Zap } from "lucide-react";

import { useWallet } from "@/components/providers/WalletProvider";

import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function Home() {
  const { connect, isConnected, address } = useWallet();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      <BackgroundAnimation />
      
      {/* Header */}
      <header className="w-full py-6 px-10 flex justify-between items-center glass-panel border-b-0 rounded-none relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-black w-5 h-5" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">QSurv</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="#" className="hover:text-primary transition">How it Works</Link>
          <Link href="#" className="hover:text-primary transition">Features</Link>
          <Link href="#" className="hover:text-primary transition">Docs</Link>
        </nav>
        <button 
          onClick={() => connect("metamask")}
          className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition flex items-center gap-2 cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
            <Zap className="w-3 h-3" />
            Powered by Qubic Network
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
            Trustless Surveys. <br />
            <span className="text-gradient">Instant Rewards.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto text-balance">
            Create surveys backed by smart contracts. Respondents get paid instantly in QUs upon AI verification. Fair, transparent, and automated.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-[var(--primary)] text-[var(--background)] font-bold rounded-full hover:scale-105 transition flex items-center gap-2 cursor-pointer z-50 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition font-medium cursor-pointer z-50 flex items-center justify-center"
            >
              View Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        Built for Qubic Hackathon 2025 (Nostromo Track)
      </footer>
    </div>
  );
}
