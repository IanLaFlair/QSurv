"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Wallet, TrendingUp, Shield, Award } from "lucide-react";

interface WalletProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export default function WalletProfileModal({ isOpen, onClose, address }: WalletProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({
    balance: 0,
    tier: "None",
    earnings: 0,
    staked: 0
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = 'unset';
      setVisible(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && address) {
      fetchUserData();
    }
  }, [isOpen, address]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user/staking?address=${address}`);
      const data = await res.json();
      if (data.success) {
        setUser({
          balance: 100000000, // Mock balance
          tier: data.user.tier,
          earnings: data.user.earnings || 0,
          staked: data.user.stakingBalance
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-[#0a0a0a] border-t sm:border border-white/20 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
          visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-full sm:translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">My Wallet</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Balance */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Total Balance</div>
            <div className="text-3xl font-bold text-white">
              {user.balance.toLocaleString()} <span className="text-primary text-xl">QUs</span>
            </div>
            <div className="text-xs font-mono text-gray-500 mt-2 bg-white/5 py-1 px-3 rounded-full inline-block">
              {address}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-400">Earnings</span>
              </div>
              <div className="font-bold text-white">{user.earnings.toLocaleString()} <span className="text-xs text-gray-400 font-normal">QUs</span></div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-gray-400">Staked</span>
              </div>
              <div className="font-bold text-white">{user.staked.toLocaleString()}</div>
            </div>
          </div>

          {/* Staking Tier */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-white">{user.tier} Tier</span>
              </div>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                +{user.tier === 'Oracle' ? '25%' : user.tier === 'Analyst' ? '10%' : user.tier === 'Participant' ? '5%' : '0%'} Bonus
              </span>
            </div>
            
            {/* Progress Bar Removed as per user request */}
          </div>

          <Link 
            href="/profile"
            className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition border border-white/10 text-center"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
