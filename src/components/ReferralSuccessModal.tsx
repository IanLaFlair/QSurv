"use client";

import { Gift, Copy, Check, Share2, X, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ReferralSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  walletAddress: string;
  baseReward: number;
  referralCode: string;
}

export default function ReferralSuccessModal({
  isOpen,
  onClose,
  surveyId,
  walletAddress,
  baseReward,
  referralCode
}: ReferralSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

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

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/survey/${surveyId}?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'telegram') => {
    const text = `Just earned ${baseReward} QUs on QSurv! 🎉\n\nAnswer surveys, get paid in crypto. Use my referral code and I'll earn 25% of your rewards too!`;
    const url = referralLink;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Animation Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-secondary/20 opacity-50" />

        <div className="relative p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-500/20 border-2 border-green-500/50">
              <Check className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Survey Submitted! 🎉</h2>
            <p className="text-gray-400">Your response is being verified by AI</p>
          </div>

          {/* Reward Display */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 text-center">
            <div className="text-sm text-gray-400 mb-2">You Earned</div>
            <div className="text-4xl font-bold text-primary mb-1">{baseReward} QUs</div>
            <div className="text-xs text-gray-500">Base reward (60% of pool)</div>
          </div>

          {/* Referral CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">Earn More by Referring!</div>
                <div className="text-sm text-gray-400">Get 25% of referral rewards</div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-400 text-center">Your Referral Code</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-lg font-mono text-sm text-primary text-center">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg font-medium transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share on Telegram
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
