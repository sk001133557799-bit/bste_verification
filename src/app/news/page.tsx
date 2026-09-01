"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import {
  Bell,
  Calendar,
  FileText,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { formatOfficialDate } from "@/lib/utils";

const defaultAnnouncements = [
  {
    id: "ann-1",
    title: "Declaration of Annual Examination 2026 Verified Results",
    category: "RESULT_DECLARATION",
    content: "The Board of Science and Technical Education Islamabad has officially declared and published the verified results for DAE, DIT, and Polytechnic Programs. Students can verify results and download official transcripts using Roll Number.",
    publishedAt: new Date("2026-08-20").toISOString(),
  },
  {
    id: "ann-2",
    title: "Online Verification Facility for Employers & Higher Education Institutions",
    category: "NOTIFICATION",
    content: "All domestic and international employers, embassies, and universities can verify BSTE certificates instantaneously by scanning the QR code or visiting the official verification portal.",
    publishedAt: new Date("2026-08-15").toISOString(),
  },
  {
    id: "ann-3",
    title: "Issuance of Final Transcripts and Sealed Diplomas",
    category: "NOTIFICATION",
    content: "Candidates who have completed all required semesters are informed that printed verified diplomas are dispatched to respective affiliated colleges.",
    publishedAt: new Date("2026-08-10").toISOString(),
  },
];

export default function NewsAnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const categories = [
    { id: "ALL", label: "All Updates" },
    { id: "RESULT_DECLARATION", label: "Result Gazettes" },
    { id: "NOTIFICATION", label: "Statutory Circulars" },
  ];

  const filteredAnnouncements = defaultAnnouncements.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />

      {/* Page Hero Header */}
      <section className="bg-gradient-to-br from-bste-navy-950 via-bste-navy-900 to-bste-navy-800 text-white py-14 px-4 border-b-4 border-bste-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-bste-navy-800 border border-bste-gold/40 text-bste-gold text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs">
            <Bell className="w-4 h-4" />
            <span>Public Gazette &amp; Official Notifications Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            News, Circulars &amp; Gazette Publications
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Official announcements, examination date sheets, registration schedules, and result gazette declarations issued by the Board Secretariat.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 space-y-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-bste-navy-900 text-bste-gold shadow-xs border border-bste-gold/40"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars and gazettes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-bste-navy-700 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Announcements Stream */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">No Circulars Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no circulars matching your filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        item.category === "RESULT_DECLARATION"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-bste-navy-50 text-bste-navy-800 border-bste-navy-200"
                      }`}
                    >
                      {item.category.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatOfficialDate(item.publishedAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Official Release • BSTE/EXAM/2026
                  </span>
                  <Link
                    href="/verify"
                    className="inline-flex items-center gap-1 text-xs font-bold text-bste-navy-800 hover:text-bste-gold transition-colors"
                  >
                    <span>Check Verification</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verification CTA Box */}
        <div className="bg-gradient-to-r from-bste-navy-900 to-bste-navy-800 text-white rounded-3xl p-8 shadow-xl border-2 border-bste-gold/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-bste-gold text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Roll Number Lookup</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Verify Student Transcripts &amp; Diplomas Online
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Enter your examination roll number to view and download your complete watermarked result card with cryptographic verification seal.
            </p>
          </div>

          <Link
            href="/verify"
            className="shrink-0 bg-bste-gold hover:bg-amber-400 text-bste-navy-950 font-bold px-6 py-3 rounded-2xl text-xs shadow-lg transition-all"
          >
            Launch Result Portal →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
