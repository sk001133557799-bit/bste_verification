import Link from "next/link";
import { Download, Smartphone, CheckCircle, ShieldCheck, QrCode, ArrowLeft } from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-bste-navy-800 hover:text-bste-navy-950 mb-6 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-bste-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-bste-navy-900 border-2 border-bste-gold mx-auto flex items-center justify-center shadow-lg">
              <Smartphone className="w-10 h-10 text-bste-gold" />
            </div>

            <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              Official Production Release v1.0.0
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-bste-navy-950 font-display">
              Download BSTE Islamabad Mobile App
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Official Android application for instant student certificate verification, 2D QR Code scanning, and examination result tracking.
            </p>

            {/* Direct Download Button */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/api/download/apk"
                download="bste-islamabad.apk"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-bste-navy-800 to-bste-navy-950 hover:from-bste-navy-900 hover:to-black text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all border border-bste-gold/50 group"
              >
                <Download className="w-5 h-5 text-bste-gold group-hover:scale-110 transition-transform" />
                <span>Download Android APK (5.4 MB)</span>
              </a>
            </div>

            {/* Verification Features */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-100 mt-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-xs text-bste-navy-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified &amp; Signed</span>
                </div>
                <p className="text-[11px] text-slate-500">Official cryptographic certificate authority signing.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-xs text-bste-navy-900 mb-1">
                  <QrCode className="w-4 h-4 text-bste-gold" />
                  <span>2D QR Scanner</span>
                </div>
                <p className="text-[11px] text-slate-500">Instant camera QR recognition for original transcripts.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-xs text-bste-navy-900 mb-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Offline Support</span>
                </div>
                <p className="text-[11px] text-slate-500">Saved candidate searches stored securely in device cache.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
