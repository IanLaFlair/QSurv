"use client";

import { X, Users, TrendingUp, Award, ArrowRight } from "lucide-react";

interface ReferralFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardPerRespondent: number;
}

export default function ReferralFlowModal({ isOpen, onClose, rewardPerRespondent }: ReferralFlowModalProps) {
  if (!isOpen) return null;

  const respondentReward = (rewardPerRespondent * 0.6).toFixed(0);
  const l1Reward = (rewardPerRespondent * 0.25).toFixed(0);
  const l2Reward = (rewardPerRespondent * 0.1).toFixed(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
          <div>
            <h2 className="text-2xl font-bold text-white">How Referral Rewards Work</h2>
            <p className="text-sm text-gray-400 mt-1">Multi-level viral growth mechanism</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Visual Flow */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">📊 Distribution Flow</h3>
            
            {/* Flow Diagram */}
            <div className="relative p-6 rounded-xl bg-black/20 border border-white/10">
              {/* Creator */}
              <div className="flex flex-col items-center mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Survey Creator</div>
                    <div className="text-xl font-bold text-primary">{rewardPerRespondent} QUs</div>
                    <div className="text-xs text-gray-500">per response</div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-600 rotate-90 my-4" />
              </div>

              {/* Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Respondent */}
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">Respondent</div>
                  <div className="text-2xl font-bold text-white">{respondentReward}</div>
                  <div className="text-xs text-blue-400">60%</div>
                </div>

                {/* L1 Referrer */}
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">L1 Referrer</div>
                  <div className="text-2xl font-bold text-white">{l1Reward}</div>
                  <div className="text-xs text-purple-400">25%</div>
                </div>

                {/* L2 Referrer */}
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-center">
                  <Award className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-xs text-gray-400 mb-1">L2 Referrer</div>
                  <div className="text-2xl font-bold text-white">{l2Reward}</div>
                  <div className="text-xs text-pink-400">10%</div>
                </div>

                {/* Platform */}
                <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20 text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">Platform</div>
                  <div className="text-2xl font-bold text-white">{(rewardPerRespondent * 0.05).toFixed(0)}</div>
                  <div className="text-xs text-gray-400">5%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Scenario */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">🎯 Example Scenario</h3>
            
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/10 space-y-4">
              {/* Alice */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-blue-400">A</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Alice answers survey</div>
                  <div className="text-sm text-gray-400">Gets referral code: QSURV-123-ALICE</div>
                  <div className="text-sm text-primary font-bold mt-1">Earns: {respondentReward} QUs</div>
                </div>
              </div>

              {/* Bob */}
              <div className="flex items-start gap-4 ml-8">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-purple-400">B</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Bob uses Alice's code</div>
                  <div className="text-sm text-gray-400">Answers survey with referral</div>
                  <div className="text-sm text-white mt-1">
                    • Bob earns: {respondentReward} QUs<br/>
                    • Alice earns bonus: <span className="text-purple-400 font-bold">{l1Reward} QUs</span> (L1)
                  </div>
                </div>
              </div>

              {/* Charlie */}
              <div className="flex items-start gap-4 ml-16">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-pink-400">C</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Charlie uses Bob's code</div>
                  <div className="text-sm text-gray-400">Answers survey with Bob's referral</div>
                  <div className="text-sm text-white mt-1">
                    • Charlie earns: {respondentReward} QUs<br/>
                    • Bob earns bonus: <span className="text-purple-400 font-bold">{l1Reward} QUs</span> (L1)<br/>
                    • Alice earns bonus: <span className="text-pink-400 font-bold">{l2Reward} QUs</span> (L2)
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-sm font-semibold text-gray-400 mb-2">Total Earnings:</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="text-xs text-gray-400">Alice</div>
                    <div className="text-lg font-bold text-white">{Number(respondentReward) + Number(l1Reward) + Number(l2Reward)} QUs</div>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="text-xs text-gray-400">Bob</div>
                    <div className="text-lg font-bold text-white">{Number(respondentReward) + Number(l1Reward)} QUs</div>
                  </div>
                  <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                    <div className="text-xs text-gray-400">Charlie</div>
                    <div className="text-lg font-bold text-white">{respondentReward} QUs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">✨ Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="font-semibold text-white mb-1">🚀 Viral Growth</div>
                <div className="text-sm text-gray-400">Respondents incentivized to share</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="font-semibold text-white mb-1">💰 Higher Earnings</div>
                <div className="text-sm text-gray-400">Everyone earns more by referring</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="font-semibold text-white mb-1">📈 Network Effects</div>
                <div className="text-sm text-gray-400">Exponential reach for your survey</div>
              </div>
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <div className="font-semibold text-white mb-1">🎯 Quality Data</div>
                <div className="text-sm text-gray-400">Trusted referrals = better responses</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/80 rounded-xl font-bold transition text-black"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
