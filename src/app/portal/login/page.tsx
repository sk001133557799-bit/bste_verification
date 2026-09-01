"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  GraduationCap,
  Key,
  Loader2,
  Lock,
  ShieldCheck,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingParticles from "@/components/ui/FloatingParticles";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal/admin/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your admin username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Invalid username or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Network or server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200/90 space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label
            htmlFor="login-identifier"
            className="block font-extrabold text-slate-800 uppercase tracking-wider mb-1.5"
          >
            Admin Username or Email
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="login-identifier"
              type="text"
              required
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-gold focus:border-gold focus:bg-white transition shadow-inner"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block font-extrabold text-slate-800 uppercase tracking-wider mb-1.5"
          >
            Account Password
          </label>
          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="login-password"
              type="password"
              required
              placeholder="Enter your account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3.5 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-gold focus:border-gold focus:bg-white transition shadow-inner"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs border border-gold/40 disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-gold" />
              <span>Sign In to Admin Dashboard</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
        <Link href="/verify" className="hover:text-primary-dark transition">
          Student Verification →
        </Link>
        <Link href="/contact" className="hover:text-primary-dark transition">
          Helpdesk Support
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen mesh-glow-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-gold/30 selection:text-primary-dark">
      <FloatingParticles />

      {/* Top Return Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gold hover:text-gold-bright transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Verification Portal</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-dark border-2 border-gold p-1 mx-auto shadow-2xl flex items-center justify-center text-gold">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            BSTE Admin Center
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Authorized Board Administrators &amp; Examination Officers
          </p>
        </div>

        {/* Form wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>Authorized personnel only. All access attempts are cryptographically audited.</span>
        </p>
      </div>
    </div>
  );
}
