"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  GraduationCap,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { formatOfficialDate, maskCNIC } from "@/lib/utils";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { HoverCard } from "@/components/ui/MotionWrapper";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = () => {
    setLoading(true);
    fetch("/api/reports")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard reports error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = data?.stats;
  const recentResults = data?.recentResults || [];
  const gradeDistribution = data?.gradeDistribution || [];
  const classDistribution = data?.classDistribution || [];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary-dark via-primary-navy to-primary-dark text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-gold/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gold/5 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gold font-mono font-extrabold uppercase tracking-wider bg-primary-dark/80 px-2.5 py-0.5 rounded-full border border-gold/30">
              Executive Admin Center
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Database Connected
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
            Central Examination &amp; Verification Dashboard
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Real-time examination statistics, results database management, and bulk Excel import ledger.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link
            href="/portal/admin/students"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-bright hover:from-gold-bright hover:to-gold text-primary-dark font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Result</span>
          </Link>
          <Link
            href="/portal/admin/bulk-upload"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-gold" />
            <span>Bulk Excel Import</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards with Counting Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Results */}
        <HoverCard>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Results Ledger
              </span>
              <div className="w-10 h-10 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-primary-dark">
              <AnimatedCounter value={stats?.totalResults || 0} />
            </div>
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with Central Database
            </p>
          </div>
        </HoverCard>

        {/* Passed Students */}
        <HoverCard>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Passed Candidates
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-emerald-700">
              <AnimatedCounter value={stats?.passedStudents || 0} />
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Pass Rate: <strong className="text-slate-800 font-mono">{stats?.passPercentage || 0}%</strong>
            </p>
          </div>
        </HoverCard>

        {/* Average Score */}
        <HoverCard>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Average Examination Score
              </span>
              <div className="w-10 h-10 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black font-display text-primary-dark">
              <AnimatedCounter value={stats?.averageScore || 0} decimals={1} suffix="%" />
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Board Overall Academic Average
            </p>
          </div>
        </HoverCard>

        {/* Verification Status */}
        <HoverCard>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Cryptographic Integrity
              </span>
              <div className="w-10 h-10 rounded-2xl bg-primary-navy text-gold flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold font-display text-primary-dark">
              ISO-27001
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              100% Digital QR Validation Live
            </p>
          </div>
        </HoverCard>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gold-dark" />
              <h3 className="font-extrabold text-sm text-primary-dark font-display">
                Grade Distribution Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Total: {stats?.totalResults || 0}</span>
          </div>

          <div className="space-y-3 pt-2">
            {gradeDistribution.map((item: any) => {
              const total = stats?.totalResults || 1;
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.grade} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 font-mono">Grade {item.grade}</span>
                    <span className="text-slate-500 font-mono">
                      {item.count} candidates ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.grade === "A+"
                          ? "bg-emerald-500"
                          : item.grade === "A"
                          ? "bg-blue-500"
                          : item.grade === "B"
                          ? "bg-amber-500"
                          : item.grade === "F"
                          ? "bg-red-500"
                          : "bg-primary-navy"
                      }`}
                      style={{ width: `${Math.max(percentage, item.count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Enrollment & Records Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-navy" />
              <h3 className="font-extrabold text-sm text-primary-dark font-display">
                Program Distribution Ledger
              </h3>
            </div>
            <Link
              href="/portal/admin/students"
              className="text-[11px] font-extrabold text-primary-navy hover:text-gold-dark flex items-center gap-1"
            >
              <span>Manage Records</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {classDistribution.map((item: any) => (
              <div
                key={item.title}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-extrabold text-slate-900 block truncate max-w-[280px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">Accredited Board Curriculum</span>
                </div>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-mono font-black text-primary-navy shadow-xs">
                  {item.count} Results
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Student Examination Records Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-primary-dark font-display">
              Recent Examination Results
            </h3>
            <p className="text-xs text-slate-500">
              Latest candidate examination records registered in the BSTE verification ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadDashboardData}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/portal/admin/students"
              className="px-3.5 py-2 rounded-xl bg-primary-dark text-white text-xs font-extrabold hover:bg-primary-navy transition shadow-xs"
            >
              View Full Results Ledger →
            </Link>
          </div>
        </div>

        {/* Table of Recent Records */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-primary-dark text-white font-extrabold">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class / Program</th>
                <th className="py-3 px-3 text-center">Marks &amp; %</th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentResults.map((r: any) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-black text-primary-navy">
                    {r.rollNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[220px]">{r.className}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    {r.obtainedMarks} / {r.totalMarks} ({r.percentage}%)
                  </td>
                  <td className="py-3 px-3 text-center font-black text-primary-navy">{r.grade}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        r.status === "PASSED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/verify?roll=${encodeURIComponent(r.rollNumber)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-navy hover:text-gold-dark transition"
                    >
                      <span>Inspect Card</span>
                      <ExternalLink className="w-3 h-3 text-gold" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
