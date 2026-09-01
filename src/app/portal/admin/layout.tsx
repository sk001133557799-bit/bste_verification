"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  ShieldCheck,
  User,
  Users,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ fullName?: string; role?: string; username?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.user) {
          router.push("/portal/login");
        } else {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.push("/portal/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/portal/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Student Result Records",
      href: "/portal/admin/students",
      icon: Users,
    },
    {
      name: "Bulk Excel Import",
      href: "/portal/admin/bulk-upload",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans selection:bg-gold/30 selection:text-primary-dark">
      {/* Top Admin Navigation Bar */}
      <header className="bg-primary-dark text-white sticky top-0 z-40 border-b border-gold/30 shadow-md">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-white/10"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/portal/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-navy border border-gold/50 flex items-center justify-center text-gold shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base font-display text-white block tracking-tight">
                  BSTE Admin Center
                </span>
                <span className="text-[10px] text-gold font-bold block uppercase tracking-wider">
                  Examination Board Control Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/verify"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition border border-white/15"
            >
              <span>Public Verification</span>
              <ExternalLink className="w-3 h-3 text-gold" />
            </Link>

            <div className="hidden sm:flex items-center gap-2.5 bg-primary-navy/80 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center text-gold font-black text-xs">
                {user?.fullName ? user.fullName[0] : "A"}
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-white block leading-tight">
                  {user?.fullName || "Administrator"}
                </span>
                <span className="text-[10px] text-gold uppercase font-bold">
                  {user?.role || "ADMIN"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-xs font-bold transition border border-red-500/30 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/90 pt-16 lg:pt-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col justify-between shadow-sm ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3">
                Core Administration
              </span>
              <nav className="space-y-1.5 pt-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all relative ${
                        isActive
                          ? "bg-primary-dark text-gold shadow-md font-extrabold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-primary-dark"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-slate-500"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick System Info Box */}
            <div className="bg-primary-dark text-white p-4 rounded-3xl space-y-2 border border-gold/30 shadow-md">
              <div className="flex items-center gap-2 text-gold text-xs font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>BSTE Enterprise Ledger</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Centralized database for annual examination marks verification and diploma certificates.
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center font-mono">
            BSTE System v2026.2 (Enterprise)
          </div>
        </aside>

        {/* Overlay backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
