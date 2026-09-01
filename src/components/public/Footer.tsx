import React from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Building2,
  FileCheck2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-slate-300 pt-16 pb-10 border-t-4 border-gold relative overflow-hidden font-sans">
      {/* Background Decorative Ambient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Column 1: Board Profile & Seal */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-navy to-primary-dark border-2 border-gold p-1 shadow-lg flex items-center justify-center text-gold">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-white font-extrabold text-base block font-display tracking-tight">
                  BSTE Islamabad
                </span>
                <span className="text-xs text-gold block font-semibold">
                  Statutory Technical Education Authority
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Board of Science &amp; Technical Education (BSTE) Islamabad is an autonomous
              statutory examining body responsible for curriculum standards, conducting annual board examinations,
              and issuing immutable electronic verifications for accredited polytechnic diplomas.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-bold bg-emerald-950/70 p-3 rounded-2xl border border-emerald-800/80 shadow-inner">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>ISO 27001 Certified Cryptographic Verification Ledger</span>
            </div>
          </div>

          {/* Column 2: Digital Portals */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Digital Portals &amp; Verification
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/verify"
                  className="hover:text-gold flex items-center gap-2 transition-colors group"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-gold">Student Result Verification</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/login"
                  className="hover:text-gold flex items-center gap-2 transition-colors group"
                >
                  <Shield className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 group-hover:text-gold">Admin Management Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="hover:text-gold flex items-center gap-2 transition-colors group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 group-hover:text-gold">DAE &amp; Diploma Programs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/institutes"
                  className="hover:text-gold flex items-center gap-2 transition-colors group"
                >
                  <Building2 className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 group-hover:text-gold">Affiliated Polytechnic Colleges</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gold flex items-center gap-2 transition-colors group"
                >
                  <Award className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-slate-300 group-hover:text-gold">Statutory Board Charter &amp; Rules</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verification Integrity Protocol */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Verification Security Standard
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Official transcripts, diplomas, and provisional certificates issued by BSTE Islamabad
              feature an encrypted 2D QR Code and unique alphanumeric verification hash.
            </p>
            <div className="bg-primary-navy/80 p-3.5 rounded-2xl border border-gold/30 text-[11px] text-slate-300 space-y-1.5 shadow-sm">
              <p className="font-bold text-gold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Embassies &amp; Foreign Employers:
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Direct verification endpoint: <code className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">bste.edu.pk/verify/[ID]</code>
              </p>
            </div>
          </div>

          {/* Column 4: Board Secretariat Contact */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2.5 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Board Secretariat
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="leading-snug">BSTE Examination Complex, Sector H-9/4, Islamabad Capital Territory, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span className="font-mono text-slate-200">03132765313</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span className="font-mono text-slate-200">sk001133557799@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Board of Science and Technical Education Islamabad. Government of Pakistan.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <Link href="/about" className="hover:text-gold transition">Statutory Charter</Link>
            <span>•</span>
            <Link href="/verify" className="hover:text-gold transition">Verification Portal</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gold transition">Helpdesk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
