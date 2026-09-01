"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import ResultCard, { StudentResultData } from "@/components/public/ResultCard";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import {
  AlertCircle,
  FileCheck2,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialRoll = searchParams.get("roll") || searchParams.get("query") || "";

  const [rollInput, setRollInput] = useState(initialRoll);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<StudentResultData | null>(null);

  const sampleRolls = [
    "BSTE-2026-00125",
    "BSTE-2026-00126",
    "BSTE-2026-00127",
    "BSTE-2026-00128",
    "BSTE-2025-00084",
  ];

  const fetchResult = async (rollToSearch: string) => {
    if (!rollToSearch.trim()) {
      setError("Please enter an examination Roll Number or Registration Number.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      const res = await fetch(`/api/verify?roll=${encodeURIComponent(rollToSearch.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No verified result found for this roll number.");
      } else {
        setResultData(data.data);
      }
    } catch (err) {
      console.error("Verification query error:", err);
      setError("Network or server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRoll) {
      setRollInput(initialRoll);
      fetchResult(initialRoll);
    }
  }, [initialRoll]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResult(rollInput);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-gold/30 selection:text-primary-dark">
      <Header />

      <main className="flex-1 py-12 px-4 relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary-navy/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          {/* Top Title Banner */}
          <div className="text-center space-y-3 no-print">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-primary-navy/10 text-primary-navy text-xs font-extrabold px-4 py-1.5 rounded-full border border-primary-navy/15 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Central Examination Registry Verification</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-primary-dark tracking-tight">
                Student Result &amp; Transcript Verification
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-normal">
                Enter your examination Roll Number to fetch your certified official academic result card, view detailed subject-wise marks, and download vector PDF transcripts.
              </p>
            </FadeIn>
          </div>

          {/* Minimal Search Box Card */}
          <FadeIn delay={0.4} className="no-print">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 md:p-8 max-w-3xl mx-auto space-y-6">
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="roll-input"
                    className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2"
                  >
                    Examination Roll Number / Registration No *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="roll-input"
                      type="text"
                      placeholder="e.g. BSTE-2026-00125 or BSTE-REG-2023-0941"
                      value={rollInput}
                      onChange={(e) => setRollInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-2xl font-mono text-base md:text-lg font-bold outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs sm:text-sm border border-gold/40 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-gold" />
                      <span>Searching BSTE National Database...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-5 h-5 text-gold" />
                      <span>Search &amp; Verify Transcript</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Quick Sample Test Badges */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Sample Candidate Roll Numbers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleRolls.map((roll) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={roll}
                        type="button"
                        onClick={() => {
                          setRollInput(roll);
                          fetchResult(roll);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-gold/20 hover:text-primary-dark text-slate-700 font-mono text-xs font-extrabold rounded-xl border border-slate-200/80 transition-colors cursor-pointer"
                      >
                        {roll}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Error Message Notice */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="no-print bg-red-50/90 border-l-4 border-red-500 p-5 rounded-2xl shadow-sm max-w-3xl mx-auto"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-950 text-sm">Verification Notice</h4>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">{error}</p>
                    <p className="text-[11px] text-red-600 mt-2 font-medium">
                      Tip: Ensure you entered the exact Roll Number assigned on your Admit Card (e.g. BSTE-2026-00125).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verified Official Result Card */}
          <AnimatePresence>
            {resultData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ResultCard data={resultData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-navy mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading BSTE Verification Portal...</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
