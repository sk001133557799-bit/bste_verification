"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered official email address.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-bste-navy-700/20 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-bste-gold/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bste-navy-800 border border-bste-gold/40 flex items-center justify-center font-display font-black text-bste-gold text-lg shadow-inner">
            B
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-wider text-white block">
              BSTE ISLAMABAD
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Secretariat Authentication System
            </span>
          </div>
        </Link>
        <Link
          href="/portal/login"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-bste-navy-800 text-bste-gold flex items-center justify-center mx-auto border border-bste-gold/30 shadow-lg">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Password Reset
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Enter your registered official board email to receive password reset authorization instructions.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-5 text-center">
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-5 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-sm text-emerald-200">Reset Request Dispatched</h4>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  If an account exists for <strong className="text-white">{email}</strong>, a secure reset token has been transmitted to your email.
                </p>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/60 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-bste-gold" />
                  <span>Institutional Notice</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  For emergency credential recovery, accredited teachers and college principals may contact the Board IT Controller directly at <span className="text-bste-gold font-mono">support@bste.edu.pk</span>.
                </p>
              </div>

              <Link
                href="/portal/login"
                className="block w-full py-3 text-center bg-bste-navy-700 hover:bg-bste-navy-600 text-white rounded-xl text-xs font-bold transition-all border border-bste-gold/30 shadow-md"
              >
                Return to Login Portal
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@bste.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-bste-gold focus:ring-1 focus:ring-bste-gold transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-bste-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-bste-gold/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : (
                  <span>Send Reset Authorization</span>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 text-center text-xs text-slate-500 relative z-10">
        © {new Date().getFullYear()} Board of Science and Technical Education Islamabad. Government of Pakistan.
      </footer>
    </div>
  );
}
