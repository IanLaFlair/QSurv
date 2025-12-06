"use client";

import { Gift, Copy, Check, Share2, Users } from "lucide-react";
import { useState } from "react";
import ReferralTree from "./ReferralTree";

interface ReferralBannerProps {
  surveyId: string;
  walletAddress: string | null;
  isConnected: boolean;
}

export default function ReferralBanner({ surveyId, walletAddress, isConnected }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate referral code (dummy for now, will be from smart contract later)
  const referralCode = walletAddress 
    ? `QSURV-${surveyId.slice(0, 4)}-${walletAddress.slice(0, 6)}`
    : null;
  
  const referralLink = referralCode 
    ? `${window.location.origin}/survey/${surveyId}?ref=${referralCode}`
    : null;

  // Dummy stats (will be from smart contract later)
  const referralStats = {
    totalReferrals: 0,
    earnings: 0
  };

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'telegram') => {
    const text = `Check out this survey and earn rewards! Use my referral code: ${referralCode}`;
    const url = referralLink;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url || '')}`, '_blank');
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url || '')}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <Gift className="w-5 h-5 text-primary" />
          <div>
            <div className="font-semibold text-white">Earn Extra by Referring!</div>
            <div className="text-sm text-gray-400">Connect wallet to get your referral code & earn 25% of referral rewards</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Main Referral Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10 border border-primary/30 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/20">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white mb-1">🎁 Earn Extra by Referring!</div>
              <div className="text-sm text-gray-300 mb-3">
                Share this survey & earn <span className="text-primary font-semibold">25%</span> of their rewards
              </div>
              
              {/* Referral Code */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg font-mono text-sm text-primary">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Tweet
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Tree - Expandable pyramid visualization */}
      {walletAddress && (
        <ReferralTree 
          walletAddress={walletAddress}
          surveyId={surveyId}
        />
      )}

      {/* Copy Success Toast */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-white text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-bold">Referral Link Copied!</span>
        </div>
      )}
    </div>
  );
}
