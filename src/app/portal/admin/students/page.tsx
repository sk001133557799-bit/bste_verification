"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { formatOfficialDate, maskCNIC } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SubjectRow {
  code: string;
  name: string;
  theoryMax: number;
  theoryObtained: number;
  practicalMax: number;
  practicalObtained: number;
  grade?: string;
  status?: string;
}

export default function AdminStudentsLedgerPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [className, setClassName] = useState("Diploma of Associate Engineering (DAE) in CIT");
  const [semesterYear, setSemesterYear] = useState("6th Semester / 3rd Year");
  const [examSession, setExamSession] = useState("Annual Examination 2026");
  const [instituteName, setInstituteName] = useState("Islamabad College of Technology (ICT)");
  const [cnic, setCnic] = useState("61101-1234567-1");
  const [gender, setGender] = useState("Male");
  const [signatoryName, setSignatoryName] = useState("Muhammad Sohail");
  const [signatoryTitle, setSignatoryTitle] = useState("Prof. in Astrophysics & Controller of Examination");

  // Dynamic Subjects List
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { code: "CIT-313", name: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 85, practicalMax: 50, practicalObtained: 45 },
    { code: "CIT-324", name: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 80, practicalMax: 50, practicalObtained: 44 },
    { code: "CIT-333", name: "Computer Networks & Security", theoryMax: 100, theoryObtained: 82, practicalMax: 50, practicalObtained: 42 },
    { code: "MGT-311", name: "Industrial Management", theoryMax: 100, theoryObtained: 75, practicalMax: 0, practicalObtained: 0 },
    { code: "CIT-399", name: "Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 140 },
  ]);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filterStatus) params.set("status", filterStatus);
      if (filterGrade) params.set("grade", filterGrade);
      params.set("page", String(page));
      params.set("limit", "15");

      const res = await fetch(`/api/results?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load student results ledger.");
      } else {
        setResults(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Fetch results error:", err);
      setError("Error connecting to database server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [search, filterStatus, filterGrade, page]);

  // Live auto-calculation helper
  const calculateLiveTotals = () => {
    let totalMax = 0;
    let totalObt = 0;
    subjects.forEach((s) => {
      totalMax += (Number(s.theoryMax) || 0) + (Number(s.practicalMax) || 0);
      totalObt += (Number(s.theoryObtained) || 0) + (Number(s.practicalObtained) || 0);
    });

    const percentage = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
    let grade = "F";
    let status = "FAILED";

    if (percentage >= 80) grade = "A+";
    else if (percentage >= 70) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 33) grade = "D";
    else grade = "F";

    if (percentage >= 33 && !subjects.some((s) => (Number(s.theoryObtained) / (Number(s.theoryMax) || 1)) < 0.33 && (Number(s.theoryMax) > 0))) {
      status = "PASSED";
    }

    return { totalMax, totalObt, percentage, grade, status };
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setStudentName("");
    setFatherName("");
    setRollNumber(`BSTE-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    setRegistrationNumber(`BSTE-REG-2023-${Math.floor(1000 + Math.random() * 9000)}`);
    setClassName("Diploma of Associate Engineering (DAE) in CIT");
    setSemesterYear("6th Semester / 3rd Year");
    setExamSession("Annual Examination 2026");
    setInstituteName("Islamabad College of Technology (ICT)");
    setCnic("61101-1234567-1");
    setGender("Male");
    setSignatoryName("Muhammad Sohail");
    setSignatoryTitle("Prof. in Astrophysics & Controller of Examination");
    setSubjects([
      { code: "CIT-313", name: "Web Development & Cloud Computing", theoryMax: 100, theoryObtained: 85, practicalMax: 50, practicalObtained: 45 },
      { code: "CIT-324", name: "Database Management Systems & SQL", theoryMax: 100, theoryObtained: 80, practicalMax: 50, practicalObtained: 44 },
      { code: "CIT-333", name: "Computer Networks & Security", theoryMax: 100, theoryObtained: 82, practicalMax: 50, practicalObtained: 42 },
      { code: "MGT-311", name: "Industrial Management", theoryMax: 100, theoryObtained: 75, practicalMax: 0, practicalObtained: 0 },
      { code: "CIT-399", name: "Capstone Project & Viva Voce", theoryMax: 0, theoryObtained: 0, practicalMax: 150, practicalObtained: 140 },
    ]);
    setModalError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (res: any) => {
    setIsEditing(true);
    setCurrentEditId(res.id);
    setStudentName(res.studentName);
    setFatherName(res.fatherName || "");
    setRollNumber(res.rollNumber);
    setRegistrationNumber(res.registrationNumber || "");
    setClassName(res.className);
    setSemesterYear(res.semesterYear);
    setExamSession(res.examSession);
    setInstituteName(res.instituteName || "Islamabad College of Technology (ICT)");
    setCnic(res.cnic || "61101-1234567-1");
    setGender(res.gender || "Male");
    setSignatoryName(res.signatoryName || "Muhammad Sohail");
    setSignatoryTitle(res.signatoryTitle || "Prof. in Astrophysics & Controller of Examination");

    let subList = [];
    try {
      subList = typeof res.subjects === "string" ? JSON.parse(res.subjects) : res.subjects;
    } catch {
      subList = [];
    }
    setSubjects(
      subList.length > 0
        ? subList
        : [{ code: "SUBJ-1", name: "General Course", theoryMax: 100, theoryObtained: 75, practicalMax: 50, practicalObtained: 40 }]
    );
    setModalError(null);
    setModalOpen(true);
  };

  const handleAddSubjectRow = () => {
    setSubjects([
      ...subjects,
      { code: `SUBJ-${subjects.length + 1}`, name: "New Course Title", theoryMax: 100, theoryObtained: 75, practicalMax: 50, practicalObtained: 40 },
    ]);
  };

  const handleRemoveSubjectRow = (idx: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== idx));
    }
  };

  const handleSubjectChange = (idx: number, field: keyof SubjectRow, value: any) => {
    const updated = [...subjects];
    updated[idx] = { ...updated[idx], [field]: value };
    setSubjects(updated);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !rollNumber.trim() || !className.trim()) {
      setModalError("Please provide all required student particulars.");
      return;
    }

    setModalSubmitting(true);
    setModalError(null);

    try {
      const payload = {
        studentName,
        fatherName,
        rollNumber,
        registrationNumber,
        className,
        semesterYear,
        examSession,
        instituteName,
        cnic,
        gender,
        signatoryName,
        signatoryTitle,
        subjects,
      };

      const url = isEditing ? `/api/results/${currentEditId}` : "/api/results";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        setModalError(json.error || "Failed to save student result.");
      } else {
        setModalOpen(false);
        fetchResults();
      }
    } catch (err: any) {
      setModalError(err.message || "Failed to submit result.");
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!recordToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/results/${recordToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed to delete record.");
      } else {
        setDeleteModalOpen(false);
        setRecordToDelete(null);
        fetchResults();
      }
    } catch (err) {
      alert("Error deleting record.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totals = calculateLiveTotals();

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-navy/10 text-primary-navy">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold font-display text-primary-dark tracking-tight">
              Student Result Records Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total {totalCount} examination results recorded in the centralized cryptographic ledger.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/portal/admin/bulk-upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary-dark font-extrabold text-xs transition border border-slate-300 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Bulk Excel Import</span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy text-white font-extrabold text-xs shadow-md transition border border-gold/40 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add New Result</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Roll No, Name or Reg No..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-gold focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Statuses</option>
            <option value="PASSED">Passed Only</option>
            <option value="FAILED">Failed Only</option>
          </select>

          {/* Grade Filter */}
          <select
            value={filterGrade}
            onChange={(e) => {
              setFilterGrade(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Grades</option>
            <option value="A+">Grade A+</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="F">Grade F</option>
          </select>

          <button
            type="button"
            onClick={fetchResults}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-navy mx-auto" />
            <p className="text-xs font-bold text-slate-500">Querying Result Records Database...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-extrabold text-base text-slate-800 font-display">No Results Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No examination records matched your filter criteria. Try clearing search filters or add a new record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-primary-dark text-white font-extrabold sticky top-0">
                <tr>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Class / Program</th>
                  <th className="py-3 px-3 text-center">Marks (Obt / Max)</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-primary-navy">
                      {r.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{r.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">S/D/O {r.fatherName || "N/A"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[220px]">
                      <div className="font-semibold text-slate-800 truncate">{r.className}</div>
                      <div className="text-[10px] text-slate-400">{r.semesterYear}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold">
                      <span className="text-primary-navy">{r.obtainedMarks}</span> / <span className="text-slate-500">{r.totalMarks}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">({r.percentage}%)</span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-primary-navy text-sm">{r.grade}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          r.status === "PASSED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/verify?roll=${encodeURIComponent(r.rollNumber)}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-primary-navy transition"
                          title="View Public Transcript"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-gold-dark" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(r)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Result"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRecordToDelete(r);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages} ({totalCount} total results)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* ADD / EDIT RESULT MODAL DIALOG */}
      {/* ================================================= */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary-navy text-gold flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-primary-dark font-display">
                      {isEditing ? "Edit Student Result Record" : "Add New Student Examination Result"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter student bio details, program info, and subject-wise score marks.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveResult} className="space-y-6 text-xs">
                {/* 1. Student Bio Section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    1. Candidate Particulars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                        placeholder="e.g. Muhammad Hamza"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Father&apos;s Name</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                        placeholder="e.g. Tariq Mehmood"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Examination Roll Number *</label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-mono font-black text-primary-navy"
                        placeholder="e.g. BSTE-2026-00125"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Registration Number</label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-mono font-bold"
                        placeholder="e.g. BSTE-REG-2023-0125"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">CNIC / B-Form</label>
                      <input
                        type="text"
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-mono font-bold"
                        placeholder="e.g. 61101-1234567-1"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Program & Academic Meta */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    2. Program &amp; Examination Session
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Class / Program Title *</label>
                      <input
                        type="text"
                        required
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Semester / Year</label>
                      <input
                        type="text"
                        value={semesterYear}
                        onChange={(e) => setSemesterYear(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Exam Session</label>
                      <input
                        type="text"
                        value={examSession}
                        onChange={(e) => setExamSession(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block font-bold text-slate-700 mb-1 uppercase">Affiliated College / Institute</label>
                      <input
                        type="text"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-gold font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Subject-wise Marks Table Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                      3. Subject-wise Examination Marks Breakdown
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddSubjectRow}
                      className="px-3 py-1.5 bg-primary-navy text-gold font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-primary-dark"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-primary-dark text-white font-extrabold sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">Code</th>
                          <th className="py-2.5 px-3">Subject Name</th>
                          <th className="py-2.5 px-2 text-center w-20">Th (Max)</th>
                          <th className="py-2.5 px-2 text-center w-20">Th (Obt)</th>
                          <th className="py-2.5 px-2 text-center w-20">Pr (Max)</th>
                          <th className="py-2.5 px-2 text-center w-20">Pr (Obt)</th>
                          <th className="py-2.5 px-2 text-center w-12">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {subjects.map((s, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                value={s.code}
                                onChange={(e) => handleSubjectChange(idx, "code", e.target.value)}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono font-bold uppercase"
                              />
                            </td>
                            <td className="py-2 px-2">
                              <input
                                type="text"
                                value={s.name}
                                onChange={(e) => handleSubjectChange(idx, "name", e.target.value)}
                                className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                value={s.theoryMax}
                                onChange={(e) => handleSubjectChange(idx, "theoryMax", Number(e.target.value))}
                                className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                value={s.theoryObtained}
                                onChange={(e) => handleSubjectChange(idx, "theoryObtained", Number(e.target.value))}
                                className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold text-primary-navy"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                value={s.practicalMax}
                                onChange={(e) => handleSubjectChange(idx, "practicalMax", Number(e.target.value))}
                                className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <input
                                type="number"
                                value={s.practicalObtained}
                                onChange={(e) => handleSubjectChange(idx, "practicalObtained", Number(e.target.value))}
                                className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold text-primary-navy"
                              />
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSubjectRow(idx)}
                                className="p-1 rounded text-red-500 hover:bg-red-50 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Auto Calculated Live Totals Strip */}
                <div className="bg-primary-dark text-white p-4 rounded-2xl border border-gold/40 flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                      Live Automatic Evaluation
                    </span>
                    <span className="text-xs text-slate-300 font-medium">Calculated upon subject marks updates</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block">TOTAL MARKS</span>
                      <span>{totals.totalObt} / {totals.totalMax}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">PERCENTAGE</span>
                      <span className="text-gold">{totals.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">GRADE</span>
                      <span className="text-amber-300 text-sm">{totals.grade}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">FINAL STATUS</span>
                      <span className={totals.status === "PASSED" ? "text-emerald-400" : "text-red-400"}>
                        {totals.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={modalSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-navy via-primary-dark to-primary-navy text-white font-extrabold shadow-md border border-gold/40 flex items-center gap-2"
                  >
                    {modalSubmitting && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
                    <span>{isEditing ? "Save & Update Result" : "Commit Result to Ledger"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && recordToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 font-display">
                  Delete Result Record?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete the result record for candidate{" "}
                  <strong className="text-slate-900">{recordToDelete.studentName}</strong> (
                  <span className="font-mono text-primary-navy font-bold">{recordToDelete.rollNumber}</span>)?
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteRecord}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 transition flex items-center justify-center gap-1.5"
                >
                  {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Delete Record</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
