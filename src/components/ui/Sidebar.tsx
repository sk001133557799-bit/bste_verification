"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

interface SidebarProps {
  navItems: NavItem[];
  title?: string;
  subtitle?: string;
}

export function Sidebar({ navItems, title = "BSTE PORTAL", subtitle = "Management System" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-bste-navy-950 text-white flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-5 border-b border-slate-800/80">
        <h2 className="text-xs font-bold font-display tracking-wider text-bste-gold uppercase">
          {title}
        </h2>
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/portal/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-bste-navy-800 text-bste-gold shadow-xs border border-bste-gold/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-bste-gold" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/80 text-[10px] text-slate-500 text-center font-mono">
        BSTE v2.0 • ICT ISLAMABAD
      </div>
    </aside>
  );
}
