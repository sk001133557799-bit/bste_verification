"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Loader2,
  UploadCloud,
  X,
  XCircle,
  Sparkles,
} from "lucide-react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [defaultClassName, setDefaultClassName] = useState("Diploma of Associate Engineering (DAE)");
  const [defaultSemesterYear, setDefaultSemesterYear] = useState("6th Semester / 3rd Year");
  const [defaultExamSession, setDefaultExamSession] = useState("Annual Examination 2026");
  const [defaultInstituteName, setDefaultInstituteName] = useState("Islamabad College of Technology (ICT)");

  const [loading, setLoading] = useState(false);
  const [dryRunData, setDryRunData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownloadSampleTemplate = () => {
    const sampleRows = [
      {
        "Roll Number": "BSTE-2026-00201",
        "Student Name": "Hamza Ali",
        "Registration Number": "BSTE-REG-2023-0201",
        "Father Name": "Ali Raza",
        "Class": "Diploma of Associate Engineering (DAE) in CIT",
        "Semester": "6th Semester",
        "Exam Session": "Annual Examination 2026",
        "Institute": "Islamabad College of Technology (ICT)",
        "CNIC": "61101-1234567-1",
        "Gender": "Male",
        "CIT-313": 85,
        "CIT-324": 80,
        "CIT-333": 78,
        "MGT-311": 70,
        "CIT-399": 140,
      },
      {
        "Roll Number": "BSTE-2026-00202",
        "Student Name": "Ayesha Khan",
        "Registration Number": "BSTE-REG-2023-0202",
        "Father Name": "Tariq Khan",
        "Class": "Diploma of Associate Engineering (DAE) in CIT",
        "Semester": "6th Semester",
        "Exam Session": "Annual Examination 2026",
        "Institute": "Govt Polytechnic Institute for Women",
        "CNIC": "61101-9876543-2",
        "Gender": "Female",
        "CIT-313": 92,
        "CIT-324": 90,
        "CIT-333": 88,
        "MGT-311": 84,
        "CIT-399": 145,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student_Results");
    XLSX.writeFile(wb, "BSTE_Bulk_Results_Template.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDryRunData(null);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleValidatePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an Excel (.xlsx, .xls) or CSV file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("defaultClassName", defaultClassName);
      formData.append("defaultSemesterYear", defaultSemesterYear);
      formData.append("defaultExamSession", defaultExamSession);
      formData.append("defaultInstituteName", defaultInstituteName);
      formData.append("dryRun", "true");

      const res = await fetch("/api/results/bulk-import", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Validation preview failed.");
      } else {
        setDryRunData(json);
      }
    } catch (err: any) {
      setError(err.message || "Failed to validate spreadsheet.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("defaultClassName", defaultClassName);
      formData.append("defaultSemesterYear", defaultSemesterYear);
      formData.append("defaultExamSession", defaultExamSession);
      formData.append("defaultInstituteName", defaultInstituteName);
      formData.append("dryRun", "false");

      const res = await fetch("/api/results/bulk-import", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to import records.");
      } else {
        setSuccessMessage(json.message || "Successfully imported records!");
        setDryRunData(null);
        setFile(null);
      }
    } catch (err: any) {
      setError(err.message || "Error importing records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold font-display text-primary-dark tracking-tight">
              Bulk Student Results Import
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Import hundreds of student examination results simultaneously using Excel (.xlsx, .xls) or CSV files.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={handleDownloadSampleTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary-dark font-extrabold text-xs transition border border-slate-300 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Download Sample Template</span>
        </motion.button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl text-xs text-red-700 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900">Validation Notice</h4>
              <p className="mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-2xl text-xs text-emerald-800 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-950">Bulk Import Succeeded</h4>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
            <Link
              href="/portal/admin/students"
              className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition"
            >
              View Results Ledger →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        <form onSubmit={handleValidatePreview} className="space-y-6 text-xs">
          {/* File Picker Zone */}
          <div>
            <label className="block font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Select Excel / CSV Spreadsheet File *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-primary-navy rounded-3xl p-8 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-primary-navy/10 text-primary-navy flex items-center justify-center mx-auto">
                  <UploadCloud className="w-8 h-8 text-primary-navy" />
                </div>
                {file ? (
                  <div>
                    <span className="font-bold text-sm text-primary-dark font-mono block">
                      {file.name}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {(file.size / 1024).toFixed(1)} KB • Ready for schema validation
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-extrabold text-sm text-slate-800 block font-display">
                      Click to choose spreadsheet or drag &amp; drop here
                    </span>
                    <span className="text-slate-500 text-xs">
                      Supports Excel (.xlsx, .xls) and CSV (Max 10MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Default Metadata Options */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              Default Metadata (Applied when columns are unassigned in file)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Class / Program
                </label>
                <input
                  type="text"
                  value={defaultClassName}
                  onChange={(e) => setDefaultClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Semester / Year
                </label>
                <input
                  type="text"
                  value={defaultSemesterYear}
                  onChange={(e) => setDefaultSemesterYear(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Exam Session
                </label>
                <input
                  type="text"
                  value={defaultExamSession}
                  onChange={(e) => setDefaultExamSession(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Default Institute
                </label>
                <input
                  type="text"
                  value={defaultInstituteName}
                  onChange={(e) => setDefaultInstituteName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !file}
              className="bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy hover:from-primary-dark hover:to-primary-navy text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 border border-gold/40 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
              <span>Validate &amp; Preview Records</span>
            </motion.button>
          </div>
        </form>

        {/* Dry Run Preview Section */}
        {dryRunData && (
          <div className="border-t pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-display">
                  Validation Results: {dryRunData.validCount} Valid / {dryRunData.errorCount} Errors (Total: {dryRunData.totalRows})
                </h3>
                <p className="text-xs text-slate-500">
                  Review the parsed student records before committing to the permanent database.
                </p>
              </div>

              {dryRunData.validCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={loading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Import {dryRunData.validCount} Verified Records</span>
                </motion.button>
              )}
            </div>

            {/* Table Preview */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-primary-dark text-white font-extrabold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Class / Program</th>
                    <th className="py-2.5 px-3 text-center">Marks &amp; %</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {dryRunData.records.map((r: any, idx: number) => (
                    <tr key={idx} className={r.isValid ? "hover:bg-slate-50" : "bg-red-50/60 hover:bg-red-50"}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{r.rowNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-primary-navy">{r.rollNumber}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">{r.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">{r.className}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">
                        {r.obtainedMarks} / {r.totalMarks} ({r.percentage}%)
                      </td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-primary-navy">{r.grade}</td>
                      <td className="py-2.5 px-3 text-center">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full font-bold text-[10px]" title={r.errors.join(", ")}>
                            <XCircle className="w-3 h-3" /> Error: {r.errors[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
