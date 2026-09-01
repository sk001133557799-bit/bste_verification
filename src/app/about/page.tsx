"use client";

import React from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  Scale,
  Shield,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import FloatingParticles from "@/components/ui/FloatingParticles";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-gold/30 selection:text-primary-dark">
      <Header />

      {/* Hero Banner */}
      <section className="relative mesh-glow-bg text-white py-16 px-4 border-b-4 border-gold overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-primary-navy/80 border border-gold/40 text-gold text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-gold-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Statutory Board Charter &amp; Profile</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              About BSTE Islamabad
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The Board of Science and Technical Education (BSTE) Islamabad is the apex autonomous
              examining body for polytechnic, engineering technology, and scientific diploma education in
              the Islamabad Capital Territory.
            </p>
          </FadeIn>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HoverCard>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 h-full">
              <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-primary-dark font-display">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To prescribe modern, market-relevant curricula for technical and vocational diplomas,
                enforce rigorous evaluation standards through impartial board examinations, and provide
                instant, tamper-proof verification of educational credentials for national and global stakeholders.
              </p>
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 h-full">
              <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-primary-dark font-display">Statutory Mandate</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Empowered under statutory educational board enactments to affiliate polytechnic institutions,
                administer centralized final examinations, certify technical qualifications, and maintain
                an immutable digital repository of graduate transcripts.
              </p>
            </div>
          </HoverCard>
        </div>

        {/* Executive Leadership & Controller Profile */}
        <div className="bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-gold/40 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-48 h-64 rounded-2xl overflow-hidden border-2 border-gold shadow-2xl bg-primary-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/muhammad-sohail.png"
                    alt="Muhammad Sohail - Controller of Examinations"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gold to-gold-bright text-primary-dark p-1.5 rounded-xl shadow-md border border-amber-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <h4 className="font-extrabold text-lg text-white font-display mt-4">
                Muhammad Sohail
              </h4>
              <p className="text-xs font-bold text-gold uppercase tracking-wider">
                Prof. in Astrophysics &amp; Controller of Examination
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Board of Science &amp; Technical Education Islamabad
              </p>
            </div>

            <div className="md:col-span-8 space-y-4">
              <span className="text-[11px] font-extrabold text-gold uppercase tracking-wider bg-primary-dark/80 px-3.5 py-1.5 rounded-full border border-gold/40">
                Executive Board Leadership
              </span>
              <h3 className="text-2xl font-extrabold font-display text-white">
                Controller of Examination Profile &amp; Mission
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Prof. Muhammad Sohail oversees the comprehensive evaluation, examination security, and certification infrastructure of BSTE Islamabad. With extensive academic and scientific research experience in Astrophysics and educational administration, Prof. Sohail has spearheaded the transition toward cryptographic electronic verification, tamper-proof transcript generation, and standardized technical curricula alignment with national industrial demands.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/verify"
                  className="bg-gradient-to-r from-gold to-gold-bright hover:opacity-95 text-primary-dark font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all uppercase tracking-wider"
                >
                  Verify Results Registry →
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all"
                >
                  Contact Secretariat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
