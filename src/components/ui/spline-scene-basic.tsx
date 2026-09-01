'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/Card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShieldCheck, Sparkles, FileCheck2 } from "lucide-react"
import Link from "next/link"

export function SplineSceneBasic() {
  return (
    <Card className="w-full min-h-[500px] h-auto lg:h-[520px] bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark border-2 border-gold/40 shadow-2xl relative overflow-hidden rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider w-fit">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Verification Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-gold tracking-tight leading-tight">
            Interactive 3D Digital Credential Matrix
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
            Experience our real-time cryptographic verification network. Every certificate and technical diploma issued by BSTE Islamabad is secured through multi-layer 3D biometric and cryptographic ledger protocols.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 bg-gold-gradient hover:opacity-95 text-primary-dark font-extrabold px-6 py-3 rounded-2xl text-xs shadow-gold-md transition-all uppercase tracking-wider"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Verify Candidate Results</span>
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs border border-white/20 transition-all"
            >
              <span>Security Protocols →</span>
            </Link>
          </div>
        </div>

        {/* Right content with Interactive 3D Spline Scene */}
        <div className="flex-1 relative min-h-[350px] lg:min-h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full min-h-[350px]"
          />
        </div>
      </div>
    </Card>
  )
}
