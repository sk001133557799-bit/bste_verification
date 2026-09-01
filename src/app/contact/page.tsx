"use client";

import React, { useState } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { FadeIn, HoverCard } from "@/components/ui/MotionWrapper";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Result Verification Query",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-gold/30 selection:text-primary-dark">
      <Header />

      {/* Hero Banner */}
      <section className="relative mesh-glow-bg text-white py-16 px-4 border-b-4 border-gold overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-primary-navy/80 border border-gold/40 text-gold text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-gold-sm">
              <Phone className="w-4 h-4" />
              <span>Secretariat &amp; Public Helpdesk</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              Contact BSTE Examination Board
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Get in touch with the Controller of Examinations, Student Verification Wing, or
              Affiliation Section for inquiries and assistance.
            </p>
          </FadeIn>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary-dark via-primary-navy to-primary-dark text-white rounded-3xl p-8 shadow-xl border-2 border-gold/40 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-gold uppercase tracking-wider">
                Board Headquarters
              </span>
              <h3 className="text-xl font-extrabold font-display text-white mt-1">
                Examination Complex Islamabad
              </h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white block">Official Address</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">
                    BSTE Examination Complex, Sector H-9/4, Islamabad Capital Territory, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white block">Official Contact Numbers</span>
                  <p className="font-mono text-slate-300 mt-0.5">03132765313</p>
                  <p className="font-mono text-slate-300">03335555666</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white block">Secretariat Email Desk</span>
                  <p className="font-mono text-slate-300 mt-0.5">sk001133557799@gmail.com</p>
                  <p className="font-mono text-slate-300">info@bste.edu.pk</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white block">Office Working Hours</span>
                  <p className="text-slate-300 mt-0.5">Monday – Friday: 09:00 AM – 05:00 PM</p>
                  <p className="text-slate-400 text-[11px]">Saturday – Sunday: Closed (Board Secretariat)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-[11px] text-slate-300 space-y-1">
              <span className="text-gold font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Foreign Verification Notice
              </span>
              <p className="text-slate-400 leading-relaxed">
                For urgent verification requests from foreign licensing bodies or WES, please include the student Roll No and Registration ID in the subject.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-xs border border-slate-200/90 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-primary-dark font-display">
                Send Inquiry to Board Secretariat
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in the details below. Our examination helpdesk typically responds within 24–48 business hours.
              </p>
            </div>

            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-emerald-950 text-base font-display">
                    Inquiry Submitted Successfully
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you. Your message has been forwarded to the BSTE Examination &amp; Verification Wing. A reference number has been assigned to your ticket.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Muhammad Aslam"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aslam@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Contact Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Category *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      >
                        <option value="Result Verification Query">Result Verification Query</option>
                        <option value="Certificate Correction / Duplicate">Certificate Correction / Duplicate</option>
                        <option value="Polytechnic Institute Affiliation">Polytechnic Institute Affiliation</option>
                        <option value="General Secretariat Inquiry">General Secretariat Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Message / Roll Number Particulars *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please specify your Roll Number, Registration No, Program of study, and inquiry details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-medium"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider border border-gold/40 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-gold" />
                    <span>Send Message to Secretariat</span>
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
