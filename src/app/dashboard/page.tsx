"use client";

import { ArrowUpRight, DollarSign, Users, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
          value="45,000 QUs" 
          change="+12% from last week" 
          icon={<DollarSign className="w-6 h-6 text-primary" />} 
        />
        <StatCard 
          title="Active Respondents" 
          value="1,234" 
          change="+5% new users" 
          icon={<Users className="w-6 h-6 text-secondary" />} 
        />
        <StatCard 
          title="Surveys Active" 
          value="8" 
          change="2 ending soon" 
          icon={<Activity className="w-6 h-6 text-accent" />} 
        />
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Recent Surveys</h3>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/dashboard/creator/survey/${i}`}>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-bold text-gray-500 group-hover:text-primary transition">
                    #{i}
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-primary transition">Customer Satisfaction Q{i}</h4>
                    <p className="text-sm text-gray-400">Target: 100 Respondents • Reward: 500 QUs</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-primary">Active</div>
                  <div className="text-xs text-gray-500">Created 2h ago</div>
                </div>
              </div>
            </Link>
          ))}
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
