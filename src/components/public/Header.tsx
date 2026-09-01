"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCheck2,
  GraduationCap,
  Lock,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Verify Result", href: "/verify", highlight: true },
    { name: "Programs", href: "/programs" },
    { name: "Affiliated Institutes", href: "/institutes" },
    { name: "About BSTE", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Government Micro-Bar */}
      <div className="bg-primary-dark text-slate-300 text-[11px] py-1.5 px-4 border-b border-white/10 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm"></span>
              Government of Pakistan • Federal Capital Territory
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              National Technical &amp; Vocational Examining Authority
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-gold" />
              <span>Secretariat: 03132765313</span>
            </span>
            <Link
              href="/portal/login"
              className="flex items-center gap-1 bg-gold/15 hover:bg-gold hover:text-primary-dark text-gold px-2.5 py-0.5 rounded-full transition-all font-bold text-[10px] border border-gold/30 shadow-xs"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200/80 py-2.5"
            : "bg-white border-b border-slate-200 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo Brand Emblem */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-dark to-primary-navy p-0.5 shadow-lg flex items-center justify-center border border-gold/50 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] flex flex-col items-center justify-center bg-primary-dark text-gold">
                <GraduationCap className="w-6 h-6 text-gold group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-primary-navy/10 text-primary-navy text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-primary-navy/15">
                  Statutory Board
                </span>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-2.5 h-2.5" /> ISO-27001 Verified
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold font-display text-primary-dark tracking-tight leading-tight mt-0.5 group-hover:text-primary-light transition-colors">
                Board of Science &amp; Technical Education
              </h1>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Islamabad Capital Territory, Pakistan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? "text-primary-dark bg-white shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-primary-dark hover:bg-white/60"
                  } ${link.highlight ? "text-amber-700 hover:text-amber-800" : ""}`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Verify CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all border border-gold/40 group hover:scale-[1.03] active:scale-[0.98]"
            >
              <FileCheck2 className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
              <span>Verify Result</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-primary-dark/95 backdrop-blur-2xl text-white border-t border-white/10 px-5 py-6 space-y-3 shadow-2xl overflow-hidden"
          >
            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-gold text-primary-dark shadow-md"
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gold to-gold-bright text-primary-dark py-3 rounded-xl font-extrabold text-xs shadow-md"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Verify Student Result Card</span>
              </Link>
              <Link
                href="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl font-bold text-xs border border-white/15"
              >
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>Admin Dashboard Login</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
