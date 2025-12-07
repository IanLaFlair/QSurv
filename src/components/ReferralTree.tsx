"use client";

import { ChevronRight, Users, TrendingUp, Award, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ReferralTreeProps {
  walletAddress: string;
  surveyId: string;
}

interface ReferralNode {
  address: string;
  level: number;
  earned: number;
  timestamp: string;
}

export default function ReferralTree({ walletAddress, surveyId }: ReferralTreeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    setMounted(true);
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setVisible(true));
    } else {
      document.body.style.overflow = 'unset';
      setVisible(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Dummy data (will be from smart contract later)
  const referralStats = {
    totalReferrals: 5,
    level1Count: 3,
    level2Count: 2,
    totalEarnings: 17.5,
    level1Earnings: 12.5,
    level2Earnings: 5.0
  };

  const referralTree: ReferralNode[] = [
    // Level 1 referrals
    { address: "ALICE...WALLET", level: 1, earned: 5.0, timestamp: "2 hours ago" },
    { address: "BOB...WALLET", level: 1, earned: 5.0, timestamp: "5 hours ago" },
    { address: "CAROL...WALLET", level: 1, earned: 2.5, timestamp: "1 day ago" },
    // Level 2 referrals (referred by your referrals)
    { address: "DAVE...WALLET", level: 2, earned: 2.5, timestamp: "3 hours ago" },
    { address: "EVE...WALLET", level: 2, earned: 2.5, timestamp: "6 hours ago" },
  ];

  if (referralStats.totalReferrals === 0) {
    return null; // Don't show if no referrals yet
  }

  return (
    <>
      {/* Clickable Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">Your Referral Network</div>
            <div className="text-xs text-gray-400">
              {referralStats.totalReferrals} people • {referralStats.totalEarnings} QUs earned
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition" />
      </button>

      {/* Modal Portal */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div 
            className={`relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
              visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Referral Network</h2>
                  <p className="text-sm text-gray-400">Multi-level referral earnings</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <div className="text-sm text-gray-400">Level 1 (Direct)</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{referralStats.level1Count}</div>
                  <div className="text-sm text-blue-400 mt-1">{referralStats.level1Earnings} QUs earned</div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <div className="text-sm text-gray-400">Level 2 (Indirect)</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{referralStats.level2Count}</div>
                  <div className="text-sm text-purple-400 mt-1">{referralStats.level2Earnings} QUs earned</div>
                </div>
              </div>

              {/* Visual Tree Diagram */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="text-sm font-semibold text-gray-400 mb-3">Network Structure</div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-primary flex items-center gap-2">
                    <span>👤</span>
                    <span>You (Creator)</span>
                  </div>
                  <div className="ml-4 text-blue-400 flex items-center gap-2">
                    <span>├─ 👥</span>
                    <span>{referralStats.level1Count} Direct Referrals (L1)</span>
                  </div>
                  <div className="ml-8 text-purple-400 flex items-center gap-2">
                    <span>└─ 👥</span>
                    <span>{referralStats.level2Count} Indirect Referrals (L2)</span>
                  </div>
                </div>
              </div>

              {/* Referral List */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">All Referrals</div>
                
                {referralTree.map((node, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      node.level === 1
                        ? 'bg-blue-500/5 border-blue-500/20'
                        : 'bg-purple-500/5 border-purple-500/20 ml-6'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Level Indicator */}
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          node.level === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          L{node.level}
                        </div>
                        
                        {/* Address */}
                        <div>
                          <div className="text-sm font-mono text-white">{node.address}</div>
                          <div className="text-xs text-gray-500">{node.timestamp}</div>
                        </div>
                      </div>

                      {/* Earnings */}
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">+{node.earned} QUs</div>
                        <div className="text-xs text-gray-500">earned</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white">Total Referral Earnings</div>
                  <div className="text-3xl font-bold text-primary">{referralStats.totalEarnings} QUs</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
