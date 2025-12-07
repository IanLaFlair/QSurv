"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, Home, LayoutGrid, PlusCircle, User } from "lucide-react";
import WalletConnectButton from "@/components/WalletConnectButton";
import Modal from "@/components/Modal";

import BottomNav from "@/components/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const handleFeatureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFeatureModal(true);
  };

  return (
    <div className="min-h-screen bg-black flex pb-16 md:pb-0">
      <Modal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        title="Coming Soon"
        type="default"
      >
        This feature is currently under development. Stay tuned for updates!
      </Modal>

      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black text-xs">Q</div>
            QSurv
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            href="/dashboard" 
            icon={<Home className="w-5 h-5" />} 
            label="Overview" 
            active={pathname === "/dashboard"} 
          />
          <NavItem 
            href="/dashboard/creator/create" 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Create Survey" 
            active={pathname === "/dashboard/creator/create"} 
          />
          <NavItem 
            href="/dashboard/creator" 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="My Surveys" 
            active={pathname === "/dashboard/creator" || (pathname.startsWith("/dashboard/creator/") && pathname !== "/dashboard/creator/create")} 
          />
          <NavItem 
            href="#" 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Analytics" 
            onClick={handleFeatureClick}
          />
        </nav>
      </aside>

      {/* Main Content - Full width on mobile, with left margin on desktop */}
      <main className="flex-1 md:ml-64 min-h-screen bg-gradient-premium">
        <header className="h-16 border-b border-white/10 glass-panel sticky top-0 z-10 flex items-center justify-between px-4 md:px-8">
          <h2 className="font-medium text-gray-400">Dashboard</h2>
          <div className="flex items-center gap-4">
            <WalletConnectButton />
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
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
