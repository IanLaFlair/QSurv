"use client";

import Link from "next/link";
import { BarChart3, Home, LayoutGrid, PlusCircle, Settings, User } from "lucide-react";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black text-xs">Q</div>
            QSurv
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem href="/dashboard" icon={<Home className="w-5 h-5" />} label="Overview" active />
          <NavItem href="/dashboard/creator/create" icon={<PlusCircle className="w-5 h-5" />} label="Create Survey" />
          <NavItem href="/dashboard/creator" icon={<LayoutGrid className="w-5 h-5" />} label="My Surveys" />
          <NavItem href="/dashboard/respondent" icon={<User className="w-5 h-5" />} label="Earn Rewards" />
          <NavItem href="/dashboard/analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analytics" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-gradient-premium">
        <header className="h-16 border-b border-white/10 glass-panel sticky top-0 z-10 flex items-center justify-between px-8">
          <h2 className="font-medium text-gray-400">Dashboard</h2>
          <div className="flex items-center gap-4">
            <WalletConnectButton />
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
