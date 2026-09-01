"use client";

import React, { useState } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import FloatingParticles from "@/components/ui/FloatingParticles";

export default function ProgramsPage() {
  const [search, setSearch] = useState("");

  const programsList = [
    {
      code: "DAE-CIT",
      title: "Diploma of Associate Engineering in Computer Information Technology",
      department: "Department of Computer & Information Technology",
      duration: "3 Years (6 Semesters)",
      eligibility: "Matriculation with Science (Physics, Math, Chemistry/Computer)",
      description: "Covers Full-Stack Web Development, Cloud Computing, Database Engineering, Networking, and Cybersecurity.",
      keySubjects: ["Web Development & Cloud", "Database Management Systems", "Computer Networks", "Cybersecurity", "Capstone Project"],
      icon: Cpu,
    },
    {
      code: "DAE-CIVIL",
      title: "Diploma of Associate Engineering in Civil Technology",
      department: "Department of Civil Engineering Technology",
      duration: "3 Years (6 Semesters)",
      eligibility: "Matriculation with Science (Minimum 50% Marks)",
      description: "Focuses on Reinforced Concrete Design, Quantity Surveying, Soil Mechanics, Structural Drawing, and Highway Engineering.",
      keySubjects: ["Concrete Technology & RCC", "Quantity Surveying & Estimation", "Soil Mechanics", "Highway & Transportation", "Survey Camp"],
      icon: Building2,
    },
    {
      code: "DAE-ELECT",
      title: "Diploma of Associate Engineering in Electrical Technology",
      department: "Department of Electrical & Electronics Technology",
      duration: "3 Years (6 Semesters)",
      eligibility: "Matriculation with Science",
      description: "Instruction in AC/DC Power Machinery, Industrial Automation, Power Transmission, PLC Programming, and Microcontrollers.",
      keySubjects: ["Electrical Machines", "Power Transmission & Distribution", "Industrial Automation & PLC", "Electronics Devices"],
      icon: Zap,
    },
    {
      code: "BS-TECH-AI",
      title: "Bachelor of Science in Technology (Artificial Intelligence & Robotics)",
      department: "Department of Artificial Intelligence & Emerging Tech",
      duration: "4 Years (8 Semesters)",
      eligibility: "F.Sc Pre-Engineering / ICS / DAE (Minimum 60% Marks)",
      description: "Applied Machine Learning, Computer Vision, Autonomous Robotics, Natural Language Processing, and Edge AI Systems.",
      keySubjects: ["Applied Deep Learning", "Robotics & Computer Vision", "Embedded Systems & IoT", "Data Engineering Pipelines"],
      icon: Layers,
    },
  ];

  const filteredPrograms = programsList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
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
              <BookOpen className="w-4 h-4" />
              <span>National Curricula &amp; Academic Standards</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              Accredited Technical &amp; Polytechnic Programs
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Formulated under statutory National Vocational Qualifications Framework (NVQF) with modern practical laboratory syllabi.
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
            placeholder="Search programs by title, code or discipline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none placeholder-slate-400"
          />
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <HoverCard key={prog.code}>
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary-navy text-gold flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-primary-navy/10 text-primary-navy font-mono text-xs font-black rounded-full border border-primary-navy/15">
                        {prog.code}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                        {prog.department}
                      </span>
                      <h3 className="text-lg font-extrabold font-display text-primary-dark mt-0.5 leading-snug">
                        {prog.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{prog.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-gold-dark" />
                        <span>{prog.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Statutory Accreditation</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                        Key Subject Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {prog.keySubjects.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Eligibility: Matric / Science</span>
                    <Link
                      href="/verify"
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-primary-navy hover:text-gold-dark transition"
                    >
                      <span>Verify Program Results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </HoverCard>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
