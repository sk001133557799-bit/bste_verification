"use client";

import React, { useState } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import FloatingParticles from "@/components/ui/FloatingParticles";

export default function InstitutesPage() {
  const [search, setSearch] = useState("");

  const institutes = [
    {
      code: "BSTE-INST-001",
      name: "Islamabad College of Technology (ICT)",
      type: "Government Polytechnic Institute",
      district: "Islamabad (Sector H-9)",
      address: "Sector H-9/4, Islamabad Capital Territory",
      principal: "Engr. Sultan Haider",
      phone: "+92 (51) 9258811",
      email: "ict.h9@bste.edu.pk",
      programs: ["DAE in CIT", "DAE in Civil", "DAE in Electrical", "DIT"],
    },
    {
      code: "BSTE-INST-002",
      name: "Govt Polytechnic Institute for Women",
      type: "Government Technical Institute",
      district: "Islamabad (Sector H-8)",
      address: "Street 7, Sector H-8/1, Islamabad",
      principal: "Prof. Dr. Shazia Parveen",
      phone: "+92 (51) 9257744",
      email: "gpiw.h8@bste.edu.pk",
      programs: ["DAE in CIT", "DIT", "Biomedical Technology"],
    },
    {
      code: "BSTE-INST-003",
      name: "Federal Institute of Science & Technology",
      type: "Autonomous Board Affiliate",
      district: "Islamabad (Blue Area)",
      address: "Jinnah Avenue, Blue Area, Islamabad",
      principal: "Dr. Farhan Qureshi",
      phone: "+92 (51) 2801122",
      email: "info@fist.edu.pk",
      programs: ["BS Technology in AI", "DAE in CIT", "Data Science"],
    },
    {
      code: "BSTE-INST-004",
      name: "Rawalpindi Institute of Technology",
      type: "Affiliated Regional College",
      district: "Rawalpindi",
      address: "6th Road, Murree Road, Rawalpindi",
      principal: "Engr. Khalid Mansoor",
      phone: "+92 (51) 4455667",
      email: "admin@rit.edu.pk",
      programs: ["DAE in Civil", "DAE in Electrical", "DAE in Mechanical"],
    },
  ];

  const filtered = institutes.filter(
    (inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.code.toLowerCase().includes(search.toLowerCase()) ||
      inst.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-gold/30 selection:text-primary-dark">
      <Header />

      {/* Hero Banner */}
      <section className="relative mesh-glow-bg text-white py-16 px-4 border-b-4 border-gold overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-primary-navy/80 border border-gold/40 text-gold text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-gold-sm">
              <Building2 className="w-4 h-4" />
              <span>Affiliation &amp; Quality Inspection Directorate</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              Affiliated Polytechnic Colleges &amp; Institutes
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Official roster of accredited public and autonomous colleges certified to conduct BSTE technical curricula and annual board examinations.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Search Bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 space-y-8">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-4 max-w-xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search institutes by name, code or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder-slate-400"
          />
        </div>

        {/* Institutes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((inst) => (
            <HoverCard key={inst.code}>
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-5 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> ACCREDITED
                    </span>
                    <span className="font-mono text-xs font-black text-primary-navy">{inst.code}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold font-display text-primary-dark leading-snug">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-gold-dark font-bold mt-0.5">{inst.type}</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary-navy shrink-0 mt-0.5" />
                      <span>{inst.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary-navy shrink-0" />
                      <span className="font-bold text-slate-900">{inst.principal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary-navy shrink-0" />
                      <span className="font-mono">{inst.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                      Conferred Technical Programs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {inst.programs.map((p) => (
                        <span
                          key={p}
                          className="px-2.5 py-1 rounded-lg bg-primary-navy/10 text-primary-navy text-[10px] font-extrabold border border-primary-navy/15"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Examination Center
                  </span>
                  <Link
                    href="/verify"
                    className="text-xs font-extrabold text-primary-navy hover:text-gold-dark transition"
                  >
                    Verify College Transcripts →
                  </Link>
                </div>
              </div>
            </HoverCard>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
