"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Wallet } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
      <div className="flex items-center justify-around p-2">
        <NavItem 
          href="/dashboard" 
          icon={<Home className="w-6 h-6" />} 
          label="Home" 
          active={pathname === "/dashboard"} 
        />
        <NavItem 
          href="/dashboard/creator" 
          icon={<LayoutGrid className="w-6 h-6" />} 
          label="Surveys" 
          active={pathname === "/dashboard/creator" || pathname.startsWith("/dashboard/creator/")} 
        />
        <NavItem 
          href="/profile" 
          icon={<Wallet className="w-6 h-6" />} 
          label="Wallet" 
          active={pathname === "/profile"} 
        />
      </div>
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
}) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        active 
          ? "text-primary" 
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
