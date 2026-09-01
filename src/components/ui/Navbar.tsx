"use client";

import React from "react";
import Link from "next/link";
import { User, LogOut, Bell, Shield } from "lucide-react";

interface NavbarProps {
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

export function Navbar({
  userRole = "SUPER_ADMIN",
  userName = "Executive Controller",
  onLogout,
}: NavbarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-bste-navy-800 text-bste-gold font-display font-black text-sm flex items-center justify-center">
          B
        </div>
        <div>
          <span className="font-display font-bold text-xs text-bste-navy-900 block leading-tight">
            BOARD OF SCIENCE &amp; TECHNICAL EDUCATION
          </span>
          <span className="text-[10px] text-slate-400 block -mt-0.5">
            ISLAMABAD • GOVERNMENT OF PAKISTAN
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-6 h-6 rounded-full bg-bste-navy-700 text-white flex items-center justify-center text-[10px] font-bold">
            <User className="w-3 h-3" />
          </div>
          <div className="text-left">
            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
              {userName}
            </span>
            <span className="text-[9px] font-mono text-bste-navy-700 bg-bste-navy-50 px-1.5 py-0.2 rounded border border-bste-navy-200">
              {userRole}
            </span>
          </div>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
