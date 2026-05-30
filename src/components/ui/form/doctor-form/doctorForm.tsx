"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { MdClear } from "react-icons/md";
import AddPatientDrawer from "./MangePatient";

interface DoctorDashboardProps {
  onLogout: () => void;
}

/* ─────────────────────────────────────────────
   Risk badge — same colors, sharper shape
───────────────────────────────────────────── */
const getRiskBadgeStyle = (riskLevel: string) => {
  const r = riskLevel?.toLowerCase() || "";

  if (r.includes("high"))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-50 text-red-700 font-bold text-[11px] tracking-wide border border-red-200 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        High
      </span>
    );

  if (r.includes("moderate"))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 font-bold text-[11px] tracking-wide border border-orange-200 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        Moderate
      </span>
    );

  if (r.includes("low"))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] tracking-wide border border-emerald-200 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Low
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold text-[11px] tracking-wide border border-slate-200 uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {riskLevel || "Pending"}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Highlight search match inside text
───────────────────────────────────────────── */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 text-blue-800 rounded-sm px-0.5 not-italic">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

/* ─────────────────────────────────────────────
   Skeleton row
───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[40, 56, 24, 10].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className={`h-3 bg-slate-200 rounded-full animate-pulse`}
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ─────────────────────────────────────────────
   MMSE mini progress bar
───────────────────────────────────────────── */
function MmseBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, (value / 30) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-slate-800 text-sm tabular-nums w-6 text-right">
        {value}
      </span>
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-slate-400 text-xs">/ 30</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [expandedPatientIndex, setExpandedPatientIndex] = useState<number | null>(null);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const closeModal = () => {
    setIsDirectoryModalOpen(false);
    setSearchQuery("");
    setExpandedPatientIndex(null);
  };

  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => {
      const name = (p.fullName || "").toLowerCase();
      const id = String(p.patientId || p.mrn || p.id || "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [patients, searchQuery]);

  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/patients", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setPatients(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllPatients(); }, []);

  const togglePatientDetails = async (index: number, patientId: string) => {
    if (expandedPatientIndex === index) { setExpandedPatientIndex(null); return; }
    setExpandedPatientIndex(index);
    const patient = filteredPatients[index];
    if (patient.visits) return;
    setLoadingVisits(true);
    try {
      const res = await fetch(`/api/patients/visits/${patientId}`);
      if (res.ok) {
        const visitsData = await res.json();
        setPatients((prev) =>
          prev.map((p) => (p.patientId || p.id) === patientId ? { ...p, visits: visitsData } : p)
        );
      }
    } catch (e) { console.error(e); }
    finally { setLoadingVisits(false); }
  };

  /* ── render ── */
  return (
    <>
      {/* ════════════ Google Font import ════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .dash-root { font-family: 'DM Sans', sans-serif; }
        .dash-display { font-family: 'DM Serif Display', serif; }

        /* hero grid overlay */
        .hero-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        /* shimmer for skeleton */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }

        /* row expand animation */
        @keyframes expandDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .expand-row { animation: expandDown 0.2s ease; }

        /* modal entrance */
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-in { animation: modalIn 0.25s cubic-bezier(0.22,1,0.36,1); }

        /* subtle divider rule */
        .rule { border-top: 1px solid #e2e8f0; }

        /* hover row accent */
        .patient-row:hover td:first-child { color: #1d4ed8; }

        /* number tabular */
        .tabnum { font-variant-numeric: tabular-nums; }
      `}</style>

      <div className="dash-root min-h-screen w-full bg-slate-50">

        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-blue-700 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-slate-800 font-semibold text-sm tracking-tight">
                Dr Dashboard
              </span>
              <span className="hidden sm:inline-block h-4 w-px bg-slate-300 mx-1" />
              <span className="hidden sm:inline text-slate-400 text-xs">Doctor Portal</span>
            </div>

            {/* logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 text-sm font-medium transition-all active:scale-95"
            >
              <MdOutlineLogout className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </nav>

        {/* ══════════════════════════════════════════
            PAGE CONTENT
        ══════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

          {/* ── HERO ── */}
          <div className="relative overflow-hidden rounded-2xl bg-blue-700 text-white hero-grid">

            {/* decorative corner accent */}
            <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.07]"
              style={{
                background: "radial-gradient(circle at 70% 30%, #fff 0%, transparent 70%)",
              }}
            />
            {/* bottom-left circle accent */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-800 opacity-40" />

            <div className="relative z-10 px-8 py-10 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {/* icon block */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl backdrop-blur-sm">
                  🏥
                </div>
              </div>

              {/* text */}
              <div className="space-y-2">
                <p className="text-blue-300 text-xs font-semibold tracking-[0.2em] uppercase">
                  Alzheimer's Progression Forecasting
                </p>
                <h1 className="dash-display text-3xl sm:text-4xl leading-tight">
                  Doctor Dashboard
                </h1>
                <p className="text-blue-200 text-sm max-w-md leading-relaxed">
                  Monitor cognitive progression, review AI-predicted MMSE trajectories, and manage your patient cohort in one place.
                </p>
              </div>

              {/* right stat chip */}
              <div className="sm:ml-auto flex-shrink-0">
                <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl px-5 py-4 text-center min-w-[100px]">
                  <div className="text-3xl font-bold tabnum">
                    {isLoading
                      ? <span className="inline-block w-8 h-8 bg-white/20 rounded animate-pulse" />
                      : patients.length
                    }
                  </div>
                  <div className="text-blue-300 text-xs font-medium mt-0.5 uppercase tracking-wider">
                    Patients
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION LABEL ── */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 tracking-[0.18em] uppercase">
              Quick Actions
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── ACTION CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 -mt-4">
            {/* Add patient — left card  */}
            <AddPatientDrawer onSuccess={fetchAllPatients} />

            {/* Directory — right card */}
            <button
              onClick={() => setIsDirectoryModalOpen(true)}
              className="
                group relative overflow-hidden text-left
                bg-white border border-slate-200 rounded-2xl
                px-7 py-6
                hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10
                transition-all duration-300 hover:-translate-y-0.5
                flex items-center gap-5
              "
            >
              {/* left accent bar */}
              <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-3.5 bg-emerald-50 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white rounded-xl transition-all duration-300 flex-shrink-0">
                <FaUsers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-0.5">Patient Directory</h3>
                <p className="text-sm text-slate-500">
                  Browse records, visit histories, and AI risk predictions.
                </p>
              </div>

              {/* arrow hint */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-500">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          PATIENT DIRECTORY MODAL
      ════════════════════════════════════════════════════════ */}
      {isDirectoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="modal-in relative z-[110] bg-white rounded-2xl w-full max-w-[1100px] max-h-[88vh] shadow-2xl shadow-slate-900/20 overflow-hidden flex flex-col border border-slate-200">

            {/* ── Modal header ── */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <FaUsers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base leading-none">
                    Patient Directory
                  </h2>
                  {!isLoading && (
                    <p className="text-slate-400 text-xs mt-0.5">
                      {searchQuery
                        ? `${filteredPatients.length} of ${patients.length} patients`
                        : `${patients.length} patient${patients.length !== 1 ? "s" : ""} registered`}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <IoIosCloseCircle className="w-5 h-5" />
              </button>
            </div>

            {/* ── Search bar ── */}
            <div className="px-7 py-3.5 border-b border-slate-100 bg-slate-50 flex-shrink-0">
              <div className="relative max-w-sm">
                <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setExpandedPatientIndex(null); }}
                  placeholder="Search by name or patient ID…"
                  className="
                    w-full pl-10 pr-9 py-2 rounded-lg
                    border border-slate-200 bg-white
                    text-slate-800 placeholder-slate-400
                    text-sm font-medium
                    shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                    transition-all
                  "
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setExpandedPatientIndex(null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <MdClear className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Patient ID", "Full Name", "Gender", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 tracking-[0.12em] uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                  </tbody>
                </table>
              ) : filteredPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <HiMagnifyingGlass className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm text-slate-500">
                    {searchQuery ? `No results for "${searchQuery}"` : "No patients yet"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-500 hover:text-blue-700 text-xs font-semibold underline underline-offset-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Patient ID", "Full Name", "Gender", ""].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-[11px] font-bold text-slate-400 tracking-[0.12em] uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient, index) => {
                      const pid = patient.patientId || patient.mrn || patient.id;
                      const isExpanded = expandedPatientIndex === index;

                      return (
                        <React.Fragment key={pid || index}>
                          {/* ── Patient row ── */}
                          <tr
                            onClick={() => togglePatientDetails(index, patient.patientId || patient.id)}
                            className={`
                              patient-row border-b border-slate-100 cursor-pointer
                              transition-colors duration-150
                              ${isExpanded ? "bg-blue-50/60" : "hover:bg-slate-50"}
                            `}
                          >
                            {/* ID */}
                            <td className="px-5 py-3.5">
                              <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                <HighlightMatch text={String(pid)} query={searchQuery} />
                              </span>
                            </td>

                            {/* Name */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                {/* avatar initial */}
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 select-none">
                                  {(patient.fullName || "?")[0].toUpperCase()}
                                </div>
                                <span className="font-semibold text-slate-800 text-sm">
                                  <HighlightMatch text={patient.fullName || "—"} query={searchQuery} />
                                </span>
                              </div>
                            </td>

                            {/* Gender */}
                            <td className="px-5 py-3.5">
                              {patient.gender === 1 || patient.gender === "Male" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100 uppercase tracking-wide">
                                  ♂ Male
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-pink-50 text-pink-700 text-[11px] font-bold border border-pink-100 uppercase tracking-wide">
                                  ♀ Female
                                </span>
                              )}
                            </td>

                            {/* Expand toggle */}
                            <td className="px-5 py-3.5 text-right">
                              <span className={`
                                inline-flex items-center gap-1.5 text-xs font-semibold
                                transition-colors duration-150
                                ${isExpanded ? "text-blue-600" : "text-slate-400"}
                              `}>
                                {isExpanded ? (
                                  <><FaChevronUp className="w-3 h-3" /> Hide</>
                                ) : (
                                  <><FaChevronDown className="w-3 h-3" /> Visits</>
                                )}
                              </span>
                            </td>
                          </tr>

                          {/* ── Visit sub-table ── */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={4} className="p-0 border-b border-slate-200 bg-slate-50/80">
                                <div className="expand-row px-5 py-5">

                                  {/* inner header */}
                                  <div className="flex items-center gap-2 mb-3 px-1">
                                    <div className="w-1 h-4 rounded-full bg-blue-500" />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                      Visit History — {patient.fullName}
                                    </span>
                                  </div>

                                  {loadingVisits ? (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-sm">
                                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                      Loading visits…
                                    </div>
                                  ) : patient.visits && patient.visits.length > 0 ? (
                                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                                      <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                          <tr className="bg-slate-50 border-b border-slate-100">
                                            {["Visit", "Date", "Current MMSE", "Predicted MMSE", "Δ MMSE", "Risk Level"].map((h) => (
                                              <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 tracking-[0.13em] uppercase">
                                                {h}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {patient.visits.map((visit: any, vIndex: number) => {
                                            const currentMmse = Math.abs(Number(visit.mmse)) || 0;
                                            
                                            // نقرأ القيمة من الـ Database سواء كانت مسجلة باسم futureMmse أو prediction
                                            let futureMmse = parseFloat(visit.futureMmse);
                                            if (isNaN(futureMmse) && visit.prediction && !isNaN(parseFloat(visit.prediction))) {
                                              futureMmse = parseFloat(visit.prediction);
                                            }

                                            let futureDisplay = "—";
                                            let deltaDisplay = "—";
                                            let deltaVal = 0;
                                            let riskDisplay = "Pending";

                                            if (!isNaN(futureMmse)) {
                                              futureDisplay = futureMmse.toString();
                                              // حساب الـ Delta بدقة
                                              deltaVal = futureMmse - currentMmse;
                                              deltaDisplay = deltaVal > 0
                                                ? `+${deltaVal.toFixed(1)}`
                                                : deltaVal.toFixed(1);
                                              
                                              // 💡 تطبيق القاعدة الطبية بشكل مباشر وصارم
                                              if (deltaVal < -2) {
                                                riskDisplay = "High";
                                              } else if (deltaVal < 0) {
                                                riskDisplay = "Moderate";
                                              } else {
                                                riskDisplay = "Low";
                                              }
                                            }

                                            const dateObj = new Date(visit.visitDate || visit.date);
                                            const formattedDate = dateObj.toLocaleDateString("en-US", {
                                              month: "short", year: "numeric",
                                            });

                                            return (
                                              <tr
                                                key={vIndex}
                                                className="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                                              >
                                                {/* Visit badge */}
                                                <td className="px-4 py-3">
                                                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md tabnum">
                                                    #{vIndex + 1}
                                                  </span>
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 py-3 text-slate-600 text-sm font-medium tabnum">
                                                  {formattedDate}
                                                </td>

                                                {/* Current MMSE with bar */}
                                                <td className="px-4 py-3">
                                                  <MmseBar value={currentMmse} />
                                                </td>

                                                {/* Future MMSE */}
                                                <td className="px-4 py-3">
                                                  {futureDisplay !== "—" ? (
                                                    <MmseBar value={parseFloat(futureDisplay)} />
                                                  ) : (
                                                    <span className="text-slate-400 text-sm">—</span>
                                                  )}
                                                </td>

                                                {/* Delta */}
                                                <td className="px-4 py-3">
                                                  <span className={`
                                                    font-bold text-sm tabnum
                                                    ${deltaVal < 0 ? "text-red-600" : deltaVal > 0 ? "text-emerald-600" : "text-slate-400"}
                                                  `}>
                                                    {deltaDisplay}
                                                  </span>
                                                </td>

                                                {/* Risk */}
                                                <td className="px-4 py-3">
                                                  {getRiskBadgeStyle(riskDisplay)}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-400 text-sm text-center">
                                      No visits recorded yet.
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── Modal footer ── */}
            <div className="px-7 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs text-slate-400">
                Click any row to expand visit history
              </span>
              <button
                onClick={closeModal}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}