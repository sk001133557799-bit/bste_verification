"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { SplineSceneBasic } from "@/components/ui/spline-scene-basic";
import { FadeIn, StaggerContainer, HoverCard } from "@/components/ui/MotionWrapper";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Cpu,
  FileCheck2,
  GraduationCap,
  Layers,
  Lock,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (rollNumber.trim()) {
      router.push(`/verify?roll=${encodeURIComponent(rollNumber.trim())}`);
    }
  };

  const sampleRolls = [
    "BSTE-2026-00125",
    "BSTE-2026-00126",
    "BSTE-2026-00127",
    "BSTE-2026-00128",
    "BSTE-2025-00084",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-gold/30 selection:text-primary-dark">
      <Header />

      <main className="flex-1 overflow-x-hidden">
        {/* ==================================================== */}
        {/* 1. HERO SECTION WITH VIDEO BACKDROP & PARTICLE MESH */}
        {/* ==================================================== */}
        <section className="relative mesh-glow-bg text-white pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 overflow-hidden border-b-4 border-gold">
          {/* Subtle Ambient Video Background */}
          <div className="aspect-[2/3] sm:aspect-video absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-25 mix-blend-screen">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover"
              src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
            />
          </div>

          <FloatingParticles />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Heading, Search & Actions */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                {/* 0.1s Staggered Badge */}
                <FadeIn delay={0.1}>
                  <div className="inline-flex items-center gap-2 bg-primary-navy/90 border border-gold/50 text-gold px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-gold-sm backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official National Examination Verification Authority</span>
                  </div>
                </FadeIn>

                {/* 0.2s Staggered Title */}
                <FadeIn delay={0.2}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
                    Verify Educational Diplomas &amp;{" "}
                    <span className="text-gold-gradient font-black">
                      Transcripts Online
                    </span>
                  </h1>
                </FadeIn>

                {/* 0.3s Staggered Description */}
                <FadeIn delay={0.3}>
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Instant, immutable, and tamper-proof verification of Associate Engineering (DAE),
                    polytechnic diplomas, and certified examination transcripts under the statutory seal of
                    BSTE Islamabad.
                  </p>
                </FadeIn>

                {/* 0.4s Staggered Interactive Search Box */}
                <FadeIn delay={0.4}>
                  <div className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl max-w-xl mx-auto lg:mx-0">
                    <form onSubmit={handleHeroSearch} className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Enter Roll No (e.g. BSTE-2026-00125)"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value)}
                            className="w-full bg-primary-dark/80 text-white placeholder-slate-400 border border-white/20 focus:border-gold rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                            required
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          className="bg-gold-gradient hover:opacity-95 text-primary-dark font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-gold-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 cursor-pointer"
                        >
                          <FileCheck2 className="w-4 h-4 text-primary-dark" />
                          <span>Verify Result</span>
                        </motion.button>
                      </div>

                      {/* Quick Sample Roll Numbers */}
                      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 justify-center lg:justify-start text-[11px]">
                        <span className="text-slate-400 font-semibold">Test Roll Numbers:</span>
                        {sampleRolls.slice(0, 3).map((roll) => (
                          <button
                            key={roll}
                            type="button"
                            onClick={() => {
                              setRollNumber(roll);
                              router.push(`/verify?roll=${encodeURIComponent(roll)}`);
                            }}
                            className="px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-gold hover:text-primary-dark text-slate-300 font-mono font-bold border border-white/15 transition-colors cursor-pointer"
                          >
                            {roll}
                          </button>
                        ))}
                      </div>
                    </form>
                  </div>
                </FadeIn>

                {/* 0.5s Trust Badges */}
                <FadeIn delay={0.5}>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Zero Latency Lookup</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>2D QR Code Validation</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>ISO 27001 Cryptographic Hash</span>
                    </span>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Floating Verified Result Card Hologram Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <FadeIn delay={0.4} direction="left">
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-sm sm:max-w-md"
                  >
                    {/* Glowing Backlight */}
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-gold via-amber-300 to-gold rounded-3xl blur-md opacity-40 animate-pulse-slow"></div>

                    {/* Hologram Certificate Card */}
                    <div className="relative glass-card-dark p-6 sm:p-7 rounded-3xl border border-gold/40 shadow-2xl space-y-5">
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-dark border border-gold/50 flex items-center justify-center text-gold shadow-sm">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                              National Registry Transcript
                            </span>
                            <span className="text-xs font-extrabold text-white font-display">
                              BSTE Islamabad
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>

                      {/* Student Bio Details Mock */}
                      <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">Candidate:</span>
                          <span className="text-white font-bold">Muhammad Hamza Tariq</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">Roll Number:</span>
                          <span className="text-gold font-mono font-bold">BSTE-2026-00125</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">Program:</span>
                          <span className="text-slate-200 font-semibold truncate max-w-[180px]">DAE Computer Information Tech</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">Score &amp; Grade:</span>
                          <span className="text-emerald-400 font-mono font-bold">639 / 700 (91.29% • A+)</span>
                        </div>
                      </div>

                      {/* QR Code & Signature Strip */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 bg-white p-1 rounded-xl shadow-md border border-gold/40 flex items-center justify-center">
                            <QrCode className="w-9 h-9 text-primary-dark" />
                          </div>
                          <div className="text-[10px] text-slate-400 leading-tight">
                            <span className="text-slate-200 font-bold block">Cryptographic Hash</span>
                            <span className="font-mono text-[9px] text-gold">BSTE-CERT-2026-89412</span>
                          </div>
                        </div>

                        <div className="text-right text-[10px] text-slate-400">
                          <div className="font-serif italic text-white font-bold text-xs mb-0.5">M. Sohail</div>
                          <span className="block text-slate-300 font-semibold text-[9px]">Controller of Exam</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* INFINITE SLIDER WITH PROGRESSIVE BLUR & PARTNERS */}
        {/* ==================================================== */}
        <section className="bg-primary-dark py-6 border-b border-white/10 text-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:max-w-52 md:border-r md:border-white/15 md:pr-6 shrink-0 text-center md:text-left mb-3 md:mb-0">
                <span className="text-[10px] text-gold font-extrabold uppercase tracking-widest block">
                  Institutional Accord
                </span>
                <p className="text-xs text-slate-300 font-bold">Accredited Examining Bodies &amp; Councils</p>
              </div>

              <div className="relative py-2 md:w-[calc(100%-13rem)] w-full overflow-hidden">
                <InfiniteSlider durationOnHover={20} duration={35} gap={72}>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    <span>NAVTTC PAKISTAN</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>HEC ATTESTATION</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <Award className="w-4 h-4 text-gold" />
                    <span>PBTE LAHORE ACCORD</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>SBTE KARACHI</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <Cpu className="w-4 h-4 text-gold" />
                    <span>KPBTE PESHAWAR</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-xl border border-white/10 text-slate-200 font-mono text-xs font-bold shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ISO-27001 SECURITY</span>
                  </div>
                </InfiniteSlider>

                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10"
                  direction="left"
                  blurIntensity={1.2}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10"
                  direction="right"
                  blurIntensity={1.2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 2. ANIMATED STATISTICS METRICS SECTION */}
        {/* ==================================================== */}
        <section className="py-14 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Stat 1 */}
              <HoverCard>
                <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6 text-primary-navy" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-primary-dark">
                    <AnimatedCounter value={50000} suffix="+" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Conferred Diplomas
                  </p>
                </div>
              </HoverCard>

              {/* Stat 2 */}
              <HoverCard>
                <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-gold-dark" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-primary-dark">
                    <AnimatedCounter value={35} suffix="+" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Affiliated Colleges
                  </p>
                </div>
              </HoverCard>

              {/* Stat 3 */}
              <HoverCard>
                <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-primary-dark">
                    <AnimatedCounter value={40} suffix="+" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Technical Curricula
                  </p>
                </div>
              </HoverCard>

              {/* Stat 4 */}
              <HoverCard>
                <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-primary-dark">
                    <AnimatedCounter value={100} suffix="%" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Verification Accuracy
                  </p>
                </div>
              </HoverCard>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3. FOUR INSTITUTIONAL SECURITY PILLARS */}
        {/* ==================================================== */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark bg-gold/15 px-3.5 py-1.5 rounded-full border border-gold/30">
                Statutory Assurance Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-primary-dark tracking-tight">
                Government Cryptographic Verification Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Designed to safeguard the credibility of Pakistani engineering graduates across international
                embassies, foreign licensing authorities, and domestic industry employers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-dark font-display">
                    2D Dynamic QR Hash
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct validation of digital marks transcripts by scanning the encrypted high-density 2D barcode on any smartphone.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold block pt-2 border-t border-slate-100">
                  ISO-27001 Certified
                </span>
              </div>

              {/* Pillar 2 */}
              <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-dark font-display">
                    Anti-Tamper Record
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Permanent electronic ledger guaranteeing that certificates cannot be forged, manipulated, or revoked without record.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold block pt-2 border-t border-slate-100">
                  Immutable Cryptographic Hash
                </span>
              </div>

              {/* Pillar 3 */}
              <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-dark font-display">
                    Secure Admin Ledger
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exclusive role-based administration with audit logs, bulk Excel processing, and automatic marks calculations.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold block pt-2 border-t border-slate-100">
                  Bcrypt &amp; JWT Encrypted
                </span>
              </div>

              {/* Pillar 4 */}
              <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-primary-dark font-display">
                    Legal Conformance
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Conforms with the ICT Technical Education Statutory Act, internationally recognized by foreign embassies and credential evaluators.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold block pt-2 border-t border-slate-100">
                  Federal Capital Territory
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* DEDICATED INTERACTIVE 3D SPLINE SCENE SECTION */}
        {/* ==================================================== */}
        <section className="py-16 bg-slate-100/70 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn delay={0.2}>
              <SplineSceneBasic />
            </FadeIn>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 4. FEATURED ACCREDITED TECHNICAL PROGRAMS */}
        {/* ==================================================== */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark">
                  Academic Disciplines
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-primary-dark">
                  Accredited Polytechnic &amp; Diploma Programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  Curricula formulated in accordance with National Vocational Qualifications Framework (NVQF).
                </p>
              </div>

              <Link
                href="/programs"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-navy hover:text-gold-dark transition"
              >
                <span>View Full Curriculum Index</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Program 1 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-gold/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">
                    3 Years • 6 Semesters
                  </span>
                  <h3 className="text-base font-bold text-primary-dark font-display leading-snug">
                    DAE in Computer Information Technology
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full-Stack Web Development, Database Systems, Computer Networks, Cloud Engineering, and Cyber Security.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-primary-navy">
                  <span>Code: DAE-CIT</span>
                  <span className="text-emerald-700">Verified</span>
                </div>
              </div>

              {/* Program 2 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-gold/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">
                    3 Years • 6 Semesters
                  </span>
                  <h3 className="text-base font-bold text-primary-dark font-display leading-snug">
                    DAE in Civil Engineering Technology
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reinforced Concrete Design, Quantity Surveying, Soil Mechanics, Highway Engineering, and CAD.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-primary-navy">
                  <span>Code: DAE-CIVIL</span>
                  <span className="text-emerald-700">Verified</span>
                </div>
              </div>

              {/* Program 3 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-gold/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">
                    3 Years • 6 Semesters
                  </span>
                  <h3 className="text-base font-bold text-primary-dark font-display leading-snug">
                    DAE in Electrical Technology
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AC/DC Machinery, Power Transmission &amp; Distribution, Industrial Automation, and PLC Programming.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-primary-navy">
                  <span>Code: DAE-ELECT</span>
                  <span className="text-emerald-700">Verified</span>
                </div>
              </div>

              {/* Program 4 */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-gold/60 hover:shadow-lg transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase">
                    1 Year Professional
                  </span>
                  <h3 className="text-base font-bold text-primary-dark font-display leading-snug">
                    Diploma in Information Technology (DIT)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Office Automation, Web Scripting, Database Fundamentals, and IT Hardware Systems Diagnostics.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-primary-navy">
                  <span>Code: DIT-PRO</span>
                  <span className="text-emerald-700">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 5. EXECUTIVE LEADERSHIP & CONTROLLER PROFILE */}
        {/* ==================================================== */}
        <section className="py-20 bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark text-white border-t-4 border-gold relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Professor Portrait */}
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-gold via-gold-bright to-gold rounded-3xl blur-sm opacity-75 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-gold bg-primary-dark shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/muhammad-sohail.png"
                      alt="Muhammad Sohail - Controller of Examinations"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-gold to-gold-bright text-primary-dark p-2 rounded-xl shadow-lg border border-amber-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <h4 className="font-extrabold text-xl text-white font-display tracking-tight">
                    Muhammad Sohail
                  </h4>
                  <p className="text-xs font-bold text-gold uppercase tracking-wider">
                    Prof. in Astrophysics &amp; Controller of Examination
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Board of Science &amp; Technical Education Islamabad
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className="lg:col-span-8 space-y-5 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border border-gold/40">
                  <GraduationCap className="w-4 h-4" />
                  <span>Executive Controller Message</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white leading-tight">
                  &ldquo;Bridging Technical Excellence with Immutable Public Verification&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  &ldquo;The cornerstone of Pakistan’s industrial and economic prosperity is built upon rigorous, verifiable technical expertise. At the Board of Science &amp; Technical Education Islamabad, our examination framework and cryptographic digital verification infrastructure ensure that every diploma conferred reflects authentic academic achievement, standardized practical mastery, and unquestionable legitimacy. Through immutable record-keeping and instantaneous online verification, we equip students, employers, and international institutions with absolute confidence in credentials issued under our seal.&rdquo;
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/verify"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-bright hover:from-gold-bright hover:to-gold text-primary-dark font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Verify Student Result Now</span>
                  </Link>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all"
                  >
                    <span>Read Statutory Board Charter →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
