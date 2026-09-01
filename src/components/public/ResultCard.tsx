"use client";

import React, { useRef, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  GraduationCap,
  Printer,
  QrCode,
  Share2,
  ShieldCheck,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  FileCheck2,
  Building2,
} from "lucide-react";
import { maskCNIC, formatOfficialDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { generateOfficialResultPdf } from "@/lib/pdf-generator";

export interface StudentResultData {
  id?: string;
  student: {
    fullName: string;
    fatherName: string;
    rollNumber: string;
    registrationNumber?: string;
    cnic?: string;
    gender?: string;
    className: string;
    semesterYear: string;
    instituteName: string;
  };
  result: {
    examSession: string;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    gpa?: number;
    grade: string;
    status: string;
    verificationId: string;
    issueDate: string;
    signatoryName: string;
    signatoryTitle: string;
  };
  marks: {
    id: string;
    code: string;
    name: string;
    theoryMax: number;
    theoryObtained: number;
    practicalMax: number;
    practicalObtained: number;
    totalMax: number;
    totalObtained: number;
    grade: string;
    status: string;
  }[];
  verificationUrl?: string;
  qrDataUrl?: string;
}

interface ResultCardProps {
  data: StudentResultData;
}

export default function ResultCard({ data }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { student, result, marks, verificationUrl, qrDataUrl } = data;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = verificationUrl || window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    setDownloadError(null);

    try {
      await generateOfficialResultPdf(cardRef.current, data);
    } catch (err) {
      console.error("PDF download failed:", err);
      setDownloadError("Failed to generate PDF automatically. Opening print view as fallback...");
      setTimeout(() => {
        window.print();
      }, 1000);
    } finally {
      setDownloading(false);
    }
  };

  const isPassed = result.status.toUpperCase() === "PASSED";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (Hidden when Printing) */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl shadow-lg border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-primary-dark text-sm sm:text-base font-display">
                Verified Academic Record Found
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 uppercase">
                Authentic
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Roll No: <span className="font-bold text-primary-navy">{student.rollNumber}</span> | Cert ID:{" "}
              <span className="font-bold text-primary-navy">{result.verificationId}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition shadow-xs border border-slate-300 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-primary-navy" />
            <span>Print Result</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white transition shadow-md border border-gold/50 disabled:opacity-60 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>Generating Official PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-gold" />
                <span>Download Official Result PDF</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition border border-amber-300 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-700" />
            <span>{copied ? "Link Copied!" : "Share Link"}</span>
          </motion.button>
        </div>
      </div>

      {/* Fallback download error notice */}
      <AnimatePresence>
        {downloadError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="no-print bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-xs text-amber-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{downloadError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* LUXURY GOVERNMENT OFFICIAL CERTIFICATE & TRANSCRIPT LAYOUT */}
      {/* ============================================================ */}
      <div
        ref={cardRef}
        id="official-result-card"
        className="certificate-frame rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <div className="certificate-inner-border cert-guilloche-bg rounded-2xl relative overflow-hidden">
          {/* Subtle Security Guilloche Watermark */}
          <div className="absolute inset-0 official-seal-bg pointer-events-none opacity-30"></div>

          {/* ==================================================== */}
          {/* 1. OFFICIAL GOVERNMENT HEADER */}
          {/* ==================================================== */}
          <div className="relative border-b-2 border-primary-navy pb-5 mb-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              {/* Official BSTE Emblem */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark border-2 border-gold p-1 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-primary-dark flex flex-col items-center justify-center text-gold">
                  <GraduationCap className="w-9 h-9" />
                  <span className="text-[7px] font-mono tracking-widest font-extrabold text-gold">ESTD 1984</span>
                </div>
              </div>

              {/* Board Titles & Authority */}
              <div className="flex-1 space-y-0.5">
                <span className="text-[9.5px] font-black tracking-widest text-slate-600 uppercase block">
                  Government of Pakistan • Federal Capital Territory
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display text-primary-dark tracking-tight leading-tight">
                  BOARD OF SCIENCE &amp; TECHNICAL EDUCATION
                </h2>
                <p className="text-xs font-black text-gold-dark tracking-widest uppercase">
                  ISLAMABAD CAPITAL TERRITORY, PAKISTAN
                </p>
                <div className="inline-block mt-1 bg-primary-dark text-gold text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-xs border border-gold/50">
                  Official Marks Transcript &amp; Verified Result Certificate
                </div>
              </div>

              {/* Digital Verification & Stamp Badge */}
              <div className="flex flex-col items-center md:items-end justify-center shrink-0">
                <div className="w-28 h-24 border-2 border-emerald-600 rounded-2xl p-1.5 bg-emerald-50/90 flex flex-col items-center justify-center text-center shadow-inner">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 mb-0.5" />
                  <span className="text-[9px] font-black text-emerald-950 uppercase tracking-tight">
                    DIGITALLY VERIFIED
                  </span>
                  <span className="text-[7.5px] font-mono text-emerald-700 font-bold">ISO-27001 SECURE</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 font-bold">
                  Issued: {formatOfficialDate(result.issueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 2. STUDENT PARTICULARS / PROFILE MATRIX */}
          {/* ==================================================== */}
          <div className="relative bg-slate-50/95 border border-slate-300 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-xs">
              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Candidate Full Name
                </span>
                <span className="font-black text-slate-900 text-sm font-display">{student.fullName}</span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Father&apos;s Name
                </span>
                <span className="font-black text-slate-900 text-sm font-display">{student.fatherName}</span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Examination Roll Number
                </span>
                <span className="font-mono font-black text-primary-navy text-sm bg-gold/15 px-2 py-0.5 rounded-lg border border-gold/40 inline-block">
                  {student.rollNumber}
                </span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Registration Number
                </span>
                <span className="font-mono font-bold text-slate-800">{student.registrationNumber || "N/A"}</span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  National ID / CNIC (Masked)
                </span>
                <span className="font-mono font-bold text-slate-800">{maskCNIC(student.cnic)}</span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Examination Session
                </span>
                <span className="font-bold text-slate-800">{result.examSession}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Academic Program &amp; Class
                </span>
                <span className="font-extrabold text-primary-navy text-sm">{student.className}</span>
                <span className="text-slate-500 text-xs ml-1 font-semibold">({student.semesterYear})</span>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Cryptographic Verification ID
                </span>
                <span className="font-mono font-black text-emerald-800 text-xs">{result.verificationId}</span>
              </div>

              <div className="sm:col-span-3">
                <span className="text-[9.5px] text-slate-500 uppercase font-black block">
                  Affiliated Institution / College
                </span>
                <span className="font-extrabold text-slate-900">{student.instituteName}</span>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 3. SUBJECT-WISE MARKS BREAKDOWN TABLE */}
          {/* ==================================================== */}
          <div className="relative mb-5">
            <h4 className="text-xs font-black text-primary-navy uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Subject-wise Marks &amp; Academic Evaluation Statement</span>
              <span className="text-[10px] font-medium text-slate-500 lowercase">
                (minimum qualifying benchmark: 33% in theory &amp; practical)
              </span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border-2 border-slate-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-primary-dark text-white font-bold text-[11px]">
                    <th className="py-2.5 px-3 border-r border-white/20 text-center w-10">#</th>
                    <th className="py-2.5 px-3 border-r border-white/20">Subject Code &amp; Title</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Theory (Max)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Theory (Obt)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Prac (Max)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Prac (Obt)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Total (Max)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Total (Obt)</th>
                    <th className="py-2.5 px-2 border-r border-white/20 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {marks.map((m, idx) => {
                    const isFail = m.status.toUpperCase() === "FAIL";
                    return (
                      <tr
                        key={m.id || idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                      >
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200 font-medium">
                          <span className="font-mono font-bold text-primary-navy mr-1.5">
                            {m.code}
                          </span>
                          <span className="text-slate-900 font-semibold">{m.name}</span>
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {m.theoryMax}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900 border-r border-slate-200 font-mono">
                          {m.theoryObtained}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200 font-mono">
                          {m.practicalMax}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900 border-r border-slate-200 font-mono">
                          {m.practicalObtained}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200 font-mono font-bold">
                          {m.totalMax}
                        </td>
                        <td className="py-2 px-2 text-center font-black text-primary-navy border-r border-slate-200 font-mono">
                          {m.totalObtained}
                        </td>
                        <td className="py-2 px-2 text-center font-black text-primary-navy border-r border-slate-200">
                          {m.grade}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-black ${
                              isFail
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 4. GRAND TOTAL EVALUATION SUMMARY STRIP */}
          {/* ==================================================== */}
          <div className="relative bg-gradient-to-r from-primary-dark via-primary-navy to-primary-dark text-white rounded-2xl p-3.5 sm:p-4 mb-5 shadow-xl border-2 border-gold/40">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  Total Max Marks
                </span>
                <span className="text-lg font-mono font-black text-white">
                  {result.totalMarks}
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  Total Obtained
                </span>
                <span className="text-lg font-mono font-black text-gold">
                  {result.obtainedMarks}
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  Percentage
                </span>
                <span className="text-lg font-mono font-black text-white">
                  {result.percentage.toFixed(2)}%
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  Overall Grade
                </span>
                <span className="text-lg font-black text-amber-300">
                  {result.grade}
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  CGPA Equivalent
                </span>
                <span className="text-lg font-mono font-black text-white">
                  {result.gpa ? result.gpa.toFixed(2) : "4.00"}
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex flex-col justify-center">
                <span className="text-[9px] text-slate-300 uppercase block font-black tracking-wider">
                  Final Status
                </span>
                <span
                  className={`text-sm font-black uppercase tracking-wider ${
                    isPassed ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {result.status}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* 5. LEGAL SIGNATURES, QR SCAN & OFFICIAL EMBOSSED SEAL */}
          {/* ==================================================== */}
          <div className="relative pt-4 border-t-2 border-slate-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* QR Verification Box */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-300 shadow-xs">
                <div className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-300 shrink-0 flex items-center justify-center shadow-inner">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="BSTE Verification QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-14 h-14 text-primary-dark" />
                  )}
                </div>
                <div className="text-[9.5px] text-slate-600 space-y-0.5">
                  <span className="font-extrabold text-primary-dark text-xs block flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Scan to Verify Online
                  </span>
                  <p className="font-mono">
                    Cert ID: <span className="font-bold text-slate-900">{result.verificationId}</span>
                  </p>
                  <p className="text-[8.5px] text-emerald-700 font-bold">Central National Repository Attestation</p>
                </div>
              </div>

              {/* Embossed Official Seal Stamp Placeholder */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gold/70 flex flex-col items-center justify-center text-center p-1 bg-gold/10 hidden lg:flex">
                <span className="text-[6.5px] font-black uppercase text-gold-dark tracking-tighter leading-tight">
                  OFFICIAL SEAL
                </span>
                <GraduationCap className="w-4 h-4 text-gold-dark" />
                <span className="text-[6px] font-bold text-slate-500 uppercase tracking-tighter">
                  BSTE ISB
                </span>
              </div>

              {/* Controller of Examinations Signature & Portrait */}
              <div className="flex items-center gap-3.5 text-center md:text-right justify-center md:justify-end">
                <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-slate-300 shadow-xs hidden sm:block bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/muhammad-sohail.png"
                    alt="Prof. Muhammad Sohail"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="inline-block text-center border-t border-slate-400 pt-1.5 px-3 sm:px-5">
                  <div className="text-primary-navy font-serif italic text-sm font-bold leading-tight">
                    {result.signatoryName || "Muhammad Sohail"}
                  </div>
                  <p className="text-xs font-black text-slate-900 font-display">
                    {result.signatoryName || "Muhammad Sohail"}
                  </p>
                  <p className="text-[9.5px] text-slate-600 font-bold">
                    {result.signatoryTitle || "Prof. in Astrophysics & Controller of Examination"}
                  </p>
                  <p className="text-[8.5px] text-slate-400 font-medium">Board of Science &amp; Technical Education Islamabad</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 text-center text-[8.5px] text-slate-500 font-mono">
              Note: This is an authentic digital credential issued by the Board of Science &amp; Technical Education (BSTE) Islamabad.
              Verification may be confirmed 24/7 by scanning the QR code or visiting our official portal.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
