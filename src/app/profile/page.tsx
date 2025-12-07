"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, TrendingUp, Award, Shield, ChevronRight } from "lucide-react";
import { useWallet } from "@/components/providers/WalletProvider";
import WalletConnectButton from "@/components/WalletConnectButton";
import BottomNav from "@/components/BottomNav";

export default function WalletProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'staking'>('overview');
  const { address, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    balance: 0,
    tier: "None",
    nextTier: "Participant",
    progress: 0,
    earnings: 0,
    staked: 0
  });

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
  }, [address]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user/staking?address=${address}`);
      const data = await res.json();
      if (data.success) {
        const staked = data.user.stakingBalance;
        let tier = data.user.tier;
        let nextTier = "Participant";
        let progress = 0;

        // Calculate progress
        if (staked < 1000000) {
          nextTier = "Participant";
          progress = (staked / 1000000) * 100;
        } else if (staked < 10000000) {
          nextTier = "Analyst";
          progress = ((staked - 1000000) / (10000000 - 1000000)) * 100;
        } else if (staked < 100000000) {
          nextTier = "Oracle";
          progress = ((staked - 10000000) / (100000000 - 10000000)) * 100;
        } else {
          nextTier = "Max";
          progress = 100;
        }

        setUser({
          balance: 100000000, // Mock balance for now since we don't have a full wallet indexer
          tier,
          nextTier,
          progress: Math.min(Math.round(progress), 100),
          earnings: data.user.earnings || 0,
          staked
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const handleStake = async (amount: number) => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/staking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          amount,
          action: "STAKE"
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchUserData();
        alert(`Successfully staked ${amount.toLocaleString()} QUs! You are now ${data.newTier} tier.`);
      }
    } catch (error) {
      console.error("Staking failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <Wallet className="w-16 h-16 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-400">Connect Wallet to View Profile</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24 md:pb-0">
      {/* Header */}
      <header className="h-16 border-b border-white/10 glass-panel sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black text-xs">Q</div>
            QSurv
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnectButton />
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Wallet & Profile</h1>
        </div>

        {/* Balance Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">Total Balance</div>
              <div className="text-5xl font-bold text-white mb-2">
                {user.balance.toLocaleString()} <span className="text-primary text-2xl">QUs</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">{address}</div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition border border-white/5">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-base font-medium transition relative ${
              activeTab === 'overview' 
                ? "text-primary" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('staking')}
            className={`pb-4 text-base font-medium transition relative ${
              activeTab === 'staking' 
                ? "text-primary" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Staking & Tiers
            {activeTab === 'staking' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
            )}
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Stats */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="font-medium text-white">Total Earnings</div>
                  <div className="text-xs text-gray-400">Lifetime rewards</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{user.earnings.toLocaleString()} QUs</div>
            </div>

            {/* Staked Amount */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium text-white">Currently Staked</div>
                  <div className="text-xs text-gray-400">Earning +5% bonus</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{user.staked.toLocaleString()} QUs</div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Tier Status */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Tier</div>
                <div className="text-3xl font-bold text-white flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-400" />
                  {user.tier}
                </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                {user.tier !== 'None' ? 'Bonus Active' : 'No Bonus'}
              </div>
            </div>

            {/* Tier List */}
            <div className="grid gap-6">
              <TierCard 
                name="Participant" 
                targetAmount={1000000}
                currentStaked={user.staked}
                benefits={["+5% Reward Bonus", "Profile Badge"]} 
                onStake={handleStake}
                loading={loading}
              />
              <TierCard 
                name="Analyst" 
                targetAmount={10000000}
                currentStaked={user.staked}
                benefits={["+10% Reward Bonus", "+5% Referral Boost", "Profile Badge"]} 
                onStake={handleStake}
                loading={loading}
              />
              <TierCard 
                name="Oracle" 
                targetAmount={100000000}
                currentStaked={user.staked}
                benefits={["+25% Reward Bonus", "+10% Referral Boost", "Governance Vote", "No Withdrawal Fees", "Profile Badge"]} 
                onStake={handleStake}
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}

function TierCard({ name, targetAmount, currentStaked, benefits, onStake, loading }: any) {
  const isUnlocked = currentStaked >= targetAmount;
  const needed = targetAmount - currentStaked;
  
  // Define styles based on tier name
  const getTierStyles = (tierName: string) => {
    switch (tierName) {
      case 'Oracle':
        return {
          // Outer container for border animation
          wrapper: "relative p-[1px] rounded-2xl overflow-hidden group",
          // Animated border gradient
          borderGradient: "absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-75 animate-shimmer-wave bg-[length:200%_100%]",
          // Inner card background
          inner: "relative h-full bg-black/90 backdrop-blur-xl rounded-2xl p-6 transition-all hover:bg-black/80",
          // Glow effect
          glow: "absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200",
          
          iconBg: "bg-purple-500/20 text-purple-400",
          button: "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border-purple-400/50",
          activeBadge: "bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]",
          title: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
        };
      case 'Analyst':
        return {
          wrapper: "relative p-[1px] rounded-2xl overflow-hidden group",
          borderGradient: "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 animate-shimmer-wave bg-[length:200%_100%]",
          inner: "relative h-full bg-black/90 backdrop-blur-xl rounded-2xl p-6 transition-all hover:bg-black/80",
          glow: "absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200",

          iconBg: "bg-blue-500/20 text-blue-400",
          button: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] border-blue-400/50",
          activeBadge: "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]",
          title: "text-blue-400"
        };
      default: // Participant
        return {
          wrapper: "relative rounded-2xl border border-white/10 hover:border-white/20 transition-all bg-white/5",
          borderGradient: "hidden",
          inner: "p-6",
          glow: "hidden",

          iconBg: "bg-white/10 text-gray-400",
          button: "bg-white/10 hover:bg-white/20 text-white border-white/10",
          activeBadge: "bg-gray-500 text-white",
          title: "text-white"
        };
    }
  };

  const styles = getTierStyles(name);
  const isOracle = name === 'Oracle';

  return (
    <div className={styles.wrapper}>
      {/* Animated Border Background */}
      <div className={styles.borderGradient} />
      
      {/* Outer Glow */}
      <div className={styles.glow} />

      {/* Inner Card Content */}
      <div className={styles.inner}>
        {/* Background Glow for Oracle (Inside) */}
        {isOracle && <div className="absolute top-0 right-0 p-40 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              isUnlocked ? styles.iconBg : "bg-white/5 text-gray-600"
            }`}>
              {isUnlocked ? <Award className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`text-xl font-bold ${styles.title}`}>{name}</h3>
                {isUnlocked && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles.activeBadge}`}>
                    Active
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Stake <span className="text-white font-mono">{targetAmount.toLocaleString()} QUs</span>
              </div>
              
              <div className="space-y-2">
                {benefits.map((benefit: string, i: number) => (
                  <div key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? styles.iconBg.split(" ")[0] : "bg-gray-700"}`} />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {!isUnlocked ? (
              <button
                onClick={() => onStake(needed)}
                disabled={loading}
                className={`w-full md:w-auto px-6 py-3 font-bold rounded-xl transition-all border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${styles.button}`}
              >
                {loading ? "Processing..." : `Stake ${needed.toLocaleString()} QUs`}
              </button>
            ) : (
              <div className={`hidden md:block px-6 py-3 font-bold rounded-xl border border-white/10 bg-black/20 text-gray-400`}>
                Current Tier
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
