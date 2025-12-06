"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import Link from "next/link";
import { PlusCircle, Users, DollarSign, ArrowRight, Loader2, LayoutGrid, Archive } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description: string;
  rewardPool: number;
  maxRespondents: number;
  createdAt: string;
  _count: {
    responses: number;
  };
}

export default function MySurveysPage() {
  const { address, isConnected } = useWallet();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");

  useEffect(() => {
    async function fetchSurveys() {
      if (!address) return;
      try {
        const res = await fetch(`/api/survey/list?creatorAddress=${address}`);
        const data = await res.json();
        if (data.success) {
          setSurveys(data.surveys);
        }
      } catch (error) {
        console.error("Failed to fetch surveys", error);
      } finally {
        setLoading(false);
      }
    }

    if (isConnected && address) {
      fetchSurveys();
    } else {
      setLoading(false);
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500">
          <LayoutGrid className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <p className="text-gray-400 max-w-md">Please connect your wallet to view your surveys.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const activeSurveys = surveys.filter(s => s._count.responses < s.maxRespondents);
  const inactiveSurveys = surveys.filter(s => s._count.responses >= s.maxRespondents);
  const displayedSurveys = activeTab === "active" ? activeSurveys : inactiveSurveys;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Surveys</h1>
          <p className="text-gray-400">Manage and track your survey campaigns.</p>
        </div>
        <Link 
          href="/dashboard/creator/create" 
          className="bg-primary text-black px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-4 px-2 text-sm font-medium transition relative ${
            activeTab === "active" ? "text-primary" : "text-gray-400 hover:text-white"
          }`}
        >
          Active ({activeSurveys.length})
          {activeTab === "active" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("inactive")}
          className={`pb-4 px-2 text-sm font-medium transition relative ${
            activeTab === "inactive" ? "text-primary" : "text-gray-400 hover:text-white"
          }`}
        >
          Inactive ({inactiveSurveys.length})
          {activeTab === "inactive" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {displayedSurveys.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
              {activeTab === "active" ? <LayoutGrid className="w-8 h-8" /> : <Archive className="w-8 h-8" />}
            </div>
            <h3 className="text-xl font-bold mb-2">No {activeTab} surveys found</h3>
            <p className="text-gray-400 mb-6">
              {activeTab === "active" 
                ? "You don't have any active surveys running right now." 
                : "You don't have any completed or inactive surveys."}
            </p>
            {activeTab === "active" && (
              <Link 
                href="/dashboard/creator/create" 
                className="text-primary hover:underline"
              >
                Create your first survey &rarr;
              </Link>
            )}
          </div>
        ) : (
          displayedSurveys.map((survey) => (
            <Link 
              key={survey.id} 
              href={`/dashboard/creator/survey/${survey.id}`}
              className="glass-panel p-6 rounded-xl hover:border-primary/30 transition group flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition">{survey.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    activeTab === "active" 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                  }`}>
                    {activeTab === "active" ? "Active" : "Completed"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-1 max-w-xl">{survey.description}</p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{survey._count.responses} / {survey.maxRespondents} Responses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>{survey.rewardPool.toLocaleString()} QUs Pool</span>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
