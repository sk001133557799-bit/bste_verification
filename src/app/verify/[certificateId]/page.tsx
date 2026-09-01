"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import ResultCard, { StudentResultData } from "@/components/public/ResultCard";
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CertificateVerificationPage() {
  const params = useParams();
  const certId = params?.certificateId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<StudentResultData | null>(null);

  useEffect(() => {
    if (!certId) return;

    setLoading(true);
    setError(null);

    fetch(`/api/verify?roll=${encodeURIComponent(certId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success || !json.data) {
          setError(json.error || "No verified result found for this roll number or certificate ID.");
        } else {
          setResultData(json.data);
        }
      })
      .catch((err) => {
        console.error("Certificate verify error:", err);
        setError("Failed to connect to verification server.");
      })
      .finally(() => setLoading(false));
  }, [certId]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back link */}
          <div className="no-print">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bste-navy-800 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Verification Search</span>
            </Link>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-bste-navy-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Verifying Cryptographic Record: <span className="font-mono">{certId}</span>...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-red-900 font-bold text-base">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span>Verification Failed</span>
              </div>
              <p className="text-xs text-red-700">{error}</p>
              <div className="pt-2">
                <Link
                  href="/verify"
                  className="inline-block bg-bste-navy-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Search Again →
                </Link>
              </div>
            </div>
          ) : (
            resultData && <ResultCard data={resultData} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
