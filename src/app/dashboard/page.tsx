"use client";

import { ArrowUpRight, DollarSign, Users, Activity, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";
import { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const { address } = useWallet();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurveys() {
      if (!address) {
        setLoading(false);
        return;
      }

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

    fetchSurveys();
  }, [address]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Creator</h1>
        <p className="text-gray-400">Here's what's happening with your surveys today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Distributed" 
          value="0 QUs" 
          change="Coming Soon" 
          icon={<DollarSign className="w-6 h-6 text-primary" />} 
        />
        <StatCard 
          title="Active Respondents" 
          value="0" 
          change="Coming Soon" 
          icon={<Users className="w-6 h-6 text-secondary" />} 
        />
        <StatCard 
          title="Surveys Active" 
          value={surveys.length.toString()} 
          change="Real Data" 
          icon={<Activity className="w-6 h-6 text-accent" />} 
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Your Surveys</h3>
          <Link href="/dashboard/creator/create">
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              Create New <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : surveys.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No surveys found.</p>
              <Link href="/dashboard/creator/create" className="text-primary hover:underline mt-2 inline-block">
                Create your first survey
              </Link>
            </div>
          ) : (
            surveys.map((survey) => (
              <Link key={survey.id} href={`/dashboard/creator/survey/${survey.id}`}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-bold text-gray-500 group-hover:text-primary transition text-xs">
                      {survey.title.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition">{survey.title}</h4>
                      <p className="text-sm text-gray-400">
                        Target: {survey.maxRespondents} Respondents • Reward: {survey.rewardPool} QUs
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-primary">Active</div>
                    <div className="text-xs text-gray-500">
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition duration-500">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-green-400 flex items-center gap-1">
        {change}
      </div>
    </div>
  );
}
