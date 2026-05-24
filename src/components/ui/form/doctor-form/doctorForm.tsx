"use client";

import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md"; 
import AddPatientDrawer from "./MangePatient";


// this props for log out from form 
interface DoctorDashboardProps {
  onLogout: () => void;
}

const getPredictionBadgeStyle = (prediction: string) => {
  if (!prediction) return "bg-slate-100 text-slate-500"; 
  const p = prediction.toLowerCase();
  
  if (p.includes("high")) return "bg-red-100 text-red-700 border-red-200";
  if (p.includes("moderate")) return "bg-orange-100 text-orange-700 border-orange-200";
  if (p.includes("low")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  
  return "bg-indigo-100 text-indigo-700 border-indigo-200"; 
};

export default function DoctorDashboard({ onLogout }: DoctorDashboardProps) {
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);

  const [expandedPatientIndex, setExpandedPatientIndex] = useState<number | null>(null);
  const [loadingVisits, setLoadingVisits] = useState(false);

  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/patients", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const togglePatientDetails = async (index: number, patientId: string) => {
    if (expandedPatientIndex === index) {
      setExpandedPatientIndex(null);
      return;
    }
    setExpandedPatientIndex(index);
    if (patients[index].visits) return;

    setLoadingVisits(true);
    try {
      const response = await fetch(`/api/patients/visits/${patientId}`);
      if (response.ok) {
        const visitsData = await response.json();
        setPatients((prevPatients) => {
          const updatedPatients = [...prevPatients];
          updatedPatients[index] = { ...updatedPatients[index], visits: visitsData };
          return updatedPatients;
        });
      }
    } catch (error) {
      console.error("Error fetching patient visits:", error);
    } finally {
      setLoadingVisits(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans w-full">
      
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-full transition-all border border-red-100 hover:border-red-200 shadow-sm active:scale-95"
        >
          <MdOutlineLogout className="w-10 h-10" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-white">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 flex items-center justify-center text-4xl shadow-inner">
                🏥
              </div>
              <div className="text-center sm:text-left space-y-1 mt-2">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Doctor Dashboard
                </h1>
                <p className="text-blue-200 font-medium text-lg">
                  Alzheimer&apos;s Progression Forecasting System
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex justify-center items-center mx-auto w-full px-4">
          <div className="group w-full max-w-sm bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-blue-100 group-hover:scale-110 transition-transform duration-300">
              <FaUsers />
            </div>

            <div className="flex flex-col">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                Total Patients
              </p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-20 h-10 bg-slate-200 rounded-xl animate-pulse"></span>
                ) : (
                  patients.length
                )}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AddPatientDrawer onSuccess={fetchAllPatients} />

            <button
              onClick={() => setIsDirectoryModalOpen(true)}
              className="group relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 text-left flex items-start gap-5 hover:-translate-y-1"
            >
              <div className="p-4 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 rounded-2xl transition-colors duration-300">
                <FaUsers className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  Patient Directory
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  Browse all registered patients, view histories, and track AI
                  predictions.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isDirectoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDirectoryModalOpen(false)}
          />

          <div className="relative z-[110] bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FaUsers className="text-emerald-600" /> Patient Directory
              </h2>
              <button
                onClick={() => setIsDirectoryModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <IoIosCloseCircle className="w-7 h-7" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
              {isLoading ? (
                <div className="text-center text-slate-500 py-10 font-medium">
                  Loading patients...
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-medium text-sm">
                  No patients found. Add a new patient to get started.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm relative z-20">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                        <th className="p-4 font-bold border-b border-slate-200">
                          ID
                        </th>
                        <th className="p-4 font-bold border-b border-slate-200">
                          Full Name
                        </th>
                        <th className="p-4 font-bold border-b border-slate-200">
                          Gender
                        </th>
                        <th className="p-4 font-bold border-b border-slate-200 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient, index) => (
                        <React.Fragment key={index}>
                          <tr
                            onClick={() =>
                              togglePatientDetails(
                                index,
                                patient.patientId || patient.id
                              )
                            }
                            className={`hover:bg-slate-50 transition-colors group text-lg cursor-pointer ${
                              expandedPatientIndex === index
                                ? "bg-slate-50"
                                : ""
                            }`}
                          >
                            <td className="p-4 border-b border-slate-100 font-medium text-slate-500">
                              {patient.patientId || patient.mrn || patient.id}
                            </td>
                            <td className="p-4 border-b border-slate-100 font-bold text-slate-800">
                              {patient.fullName}
                            </td>
                            <td className="p-4 border-b border-slate-100">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  patient.gender === 1 ||
                                  patient.gender === "Male"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                }`}
                              >
                                {patient.gender === 1 ||
                                patient.gender === "Male"
                                  ? "Male"
                                  : "Female"}
                              </span>
                            </td>
                            <td className="p-4 border-b border-slate-100 text-center">
                              {expandedPatientIndex === index ? (
                                <FaChevronUp className="inline-block text-slate-400 group-hover:text-blue-600 transition-colors" />
                              ) : (
                                <FaChevronDown className="inline-block text-slate-400 group-hover:text-blue-600 transition-colors" />
                              )}
                            </td>
                          </tr>

                          {expandedPatientIndex === index && (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-0 border-b border-slate-200 bg-slate-50/80"
                              >
                                <div className="px-8 py-5 border-l-4 border-blue-500 animate-in slide-in-from-top-2 duration-200">
                                  <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                    Previous Visits & AI Predictions
                                  </h4>

                                  {loadingVisits ? (
                                    <div className="text-slate-500 text-sm bg-slate-100 p-4 rounded-xl border border-slate-200 text-center animate-pulse">
                                      Loading visits...
                                    </div>
                                  ) : patient.visits &&
                                    patient.visits.length > 0 ? (
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                      <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100/50">
                                          <tr>
                                            <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">
                                              Date
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">
                                              MMSE Score
                                            </th>
                                            <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">
                                              AI Prediction (Risk)
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {patient.visits.map(
                                            (visit: any, vIndex: number) => {
                                              const isNegative =
                                                Number(visit.mmse) < 0;

                                              return (
                                                <tr
                                                  key={vIndex}
                                                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                                >
                                                  <td className="px-4 py-3 text-slate-600 font-medium">
                                                    {new Date(
                                                      visit.visitDate ||
                                                        visit.date
                                                    ).toLocaleDateString()}
                                                  </td>
                                                  <td className="px-4 py-3">
                                                    <span
                                                      className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                                                        isNegative
                                                          ? "bg-red-100 text-red-700"
                                                          : "bg-emerald-100 text-emerald-700"
                                                      }`}
                                                    >
                                                      {visit.mmse} / 30
                                                    </span>
                                                  </td>
                                                  <td className="px-4 py-3">
                                                    <span
                                                      className={`px-3 py-1 rounded-md font-bold text-xs border ${getPredictionBadgeStyle(
                                                        visit.prediction
                                                      )}`}
                                                    >
                                                      {visit.prediction || "Pending"}
                                                    </span>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-slate-500 text-sm bg-white p-4 rounded-xl border border-slate-200 text-center">
                                      No previous visits recorded for this
                                      patient.
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}