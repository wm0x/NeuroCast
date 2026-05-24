"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FaUserPlus,
  FaArrowRight,
  FaBrain,
  FaCircleCheck,
} from "react-icons/fa6";
import { IoIosArrowBack, IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";
import { FiAlertTriangle, FiActivity } from "react-icons/fi";
import CustomDrawer from "../../intro-disclosure";
import { DualRangeSlider } from "../../slider";
import { FaHistory, FaSearch } from "react-icons/fa";

interface AddPatientDrawerProps {
  onSuccess?: () => void;
}

type Step =
  | "lookup"
  | "patient_found"
  | "new_patient"
  | "visit_info"
  | "result";

const LOADING_STEPS = [
  "Normalizing Microarray Data...",
  "Applying Deep Feature Extraction...",
  "Calculating Risk & MMSE Score...",
  "Saving Patient Record...",
];

const extractMMSE = (data: any): number => {
  if (!data) return 0;
  
  console.log("🧠 AI Raw Response:", data);

  if (typeof data === "number") return data;

  const possibleKeys = [
    data.predicted_delta_mmse, 
    data.composite_risk_score, 
    data.predicted_mmse,
    data.mmse,
    data.prediction,
    data.result,
    data.score,
    data.data?.predicted_delta_mmse,
    data.data?.predicted_mmse,
  ];

  for (let val of possibleKeys) {
    if (val !== undefined && val !== null) {
      let numericVal = Array.isArray(val) ? Number(val[0]) : Number(val);
      return isNaN(numericVal) ? 0 : numericVal;
    }
  }
  
  return 0; 
};

export default function AddPatientDrawer({ onSuccess }: AddPatientDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("lookup");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Predict MMSE & Save Visit");
  const [errorMsg, setErrorMsg] = useState("");

  const [aiResultData, setAiResultData] = useState<any>(null);
  const [existingPatient, setExistingPatient] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    fullName: "",
    gender: "1",
    educationYears: "",
    ageAtVisit: "",
    AQP7: "3.75",
    RPS5: "11.25",
    CHD2: "8.25",
    SNX5: "8.3",
    ASS1: "7.5",
    Unchar: "4.0",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) {
      setErrorMsg("Please enter a valid Patient ID.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/patients/search?patientId=${formData.patientId}`
      );

      if (res.ok) {
        const data = await res.json();
        setExistingPatient(data);
        setStep("patient_found");
      } else if (res.status === 404) {
        setExistingPatient(null);
        setStep("new_patient");
      } else {
        throw new Error("Failed to lookup patient.");
      }
    } catch (error: any) {
      setExistingPatient(null);
      setStep("new_patient");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPatientNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      setErrorMsg("Please fill in the patient's full name.");
      return;
    }
    setErrorMsg("");
    setStep("visit_info");
  };

  const handlePredictAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageAtVisit) {
      setErrorMsg("Please enter the Age at Visit.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setAiResultData(null);

    let stepIndex = 0;
    setLoadingText(LOADING_STEPS[0]);
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 800);

    try {
      const geneExpressionArray = [
        Number(formData.AQP7),
        Number(formData.RPS5),
        Number(formData.CHD2),
        Number(formData.SNX5),
        Number(formData.ASS1),
        Number(formData.Unchar),
      ];

      const aiResponse = await fetch(
        "https://neuro-cast-api.vercel.app/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_data: {
              age: Number(formData.ageAtVisit),
              gender: Number(formData.gender),
              educationYears: Number(formData.educationYears) || 0,
            },
            expression: geneExpressionArray,
            is_first_visit: step === "new_patient",
          }),
        }
      );

      const json = await aiResponse.json();

      if (!aiResponse.ok || json.error) {
        throw new Error(json.error || "AI Prediction failed.");
      }

      const rawMmse = extractMMSE(json);
      // نحتفظ بالرقم مع إشارته
      const roundedMmse = Math.round(rawMmse * 10) / 10; 

      const dbPayload = {
        patientId: formData.patientId,
        ...(!existingPatient && {
          fullName: formData.fullName,
          gender: parseInt(formData.gender),
          educationYears: formData.educationYears
            ? parseInt(formData.educationYears)
            : null,
        }),
        visit: {
          ageAtVisit: parseFloat(formData.ageAtVisit),
          mmse: roundedMmse,
          aqp7: parseFloat(formData.AQP7),
          rps5: parseFloat(formData.RPS5),
          chd2: parseFloat(formData.CHD2),
          snx5: parseFloat(formData.SNX5),
          ass1: parseFloat(formData.ASS1),
          unchar: parseFloat(formData.Unchar),
          prediction: String(roundedMmse),
          confidence: json.confidence ?? null,
        },
      };

      const dbRes = await fetch("/api/patients/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      if (!dbRes.ok) {
        console.warn("Prediction succeeded, but failed to save in Database.");
      }

      clearInterval(interval);
      setAiResultData(json);
      setStep("result");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      clearInterval(interval);
      console.error("Error:", error);
      setErrorMsg(error.message || "Connection Error. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingText("Predict MMSE & Save Visit");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("lookup");
        setAiResultData(null);
        setErrorMsg("");
        setExistingPatient(null);
        setFormData({
          patientId: "",
          fullName: "",
          gender: "1",
          educationYears: "",
          ageAtVisit: "",
          AQP7: "3.75",
          RPS5: "11.25",
          CHD2: "8.25",
          SNX5: "8.3",
          ASS1: "7.5",
          Unchar: "4.0",
        });
      }, 300);
    }
  };

  const progressWidth = {
    lookup: "25%",
    patient_found: "50%",
    new_patient: "50%",
    visit_info: "75%",
    result: "100%",
  }[step];

  // 💡  تقييم النتيجة بناءً على ما إذا كانت سالبة (تدهور)، موجبة صغيرة (تحسن)، أو درجة مطلقة
  const getScoreDetails = (score: number) => {
    if (score < 0) {
      return {
        type: "delta_negative",
        label: "Cognitive Decline Predicted",
        color: "text-rose-500",
        bg: "bg-rose-500",
        border: "border-rose-500/20",
        lightBg: "bg-rose-50",
        icon: <IoMdTrendingDown className="w-5 h-5" />,
      };
    }
    if (score >= 0 && score <= 10) {
      return {
        type: "delta_positive",
        label: "Stable / Improvement",
        color: "text-emerald-500",
        bg: "bg-emerald-500",
        border: "border-emerald-500/20",
        lightBg: "bg-emerald-50",
        icon: <IoMdTrendingUp className="w-5 h-5" />,
      };
    }
    // إذا كانت النتيجة بين 11 و 30 تعتبر درجة مطلقة وليست فارق (Delta)
    if (score >= 24)
      return {
        type: "absolute",
        label: "Normal Cognition",
        color: "text-emerald-500",
        bg: "bg-emerald-500",
        border: "border-emerald-500/20",
        lightBg: "bg-emerald-50",
        icon: <FiActivity className="w-5 h-5" />,
      };
    if (score >= 18)
      return {
        type: "absolute",
        label: "Mild Cognitive Impairment",
        color: "text-amber-500",
        bg: "bg-amber-500",
        border: "border-amber-500/20",
        lightBg: "bg-amber-50",
        icon: <FiActivity className="w-5 h-5" />,
      };
    return {
      type: "absolute",
      label: "Severe Impairment",
      color: "text-rose-500",
      bg: "bg-rose-500",
      border: "border-rose-500/20",
      lightBg: "bg-rose-50",
      icon: <FiActivity className="w-5 h-5" />,
    };
  };

  const finalScore = aiResultData ? Math.round(extractMMSE(aiResultData) * 10) / 10 : 0;
  const statusDetails = getScoreDetails(finalScore);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-left flex items-start gap-5 hover:-translate-y-1 w-full"
      >
        <div className="p-4 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 rounded-2xl transition-colors duration-300">
          <FaUserPlus className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">
            Patient Evaluation
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            Lookup existing patient or register a new one to start clinical
            assessment.
          </p>
        </div>
      </button>

      <CustomDrawer open={isOpen} setOpen={handleOpenChange}>
        <div className="w-full mx-auto min-h-[100vh] flex flex-col overflow-hidden relative z-[9999] rounded-3xl bg-[#FDFBF7] border border-[#EAE5D9] shadow-2xl">
          <div className="flex bg-slate-100 h-1.5 w-full">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
              style={{ width: progressWidth }}
            />
          </div>

          
          {step === "lookup" && (
            <div className="p-8 flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <FaSearch className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-black text-slate-800">
                    Lookup Patient
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Enter Patient ID to retrieve records
                  </p>
                </div>
              </div>
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-bold flex items-center gap-2">
                  <FiAlertTriangle className="w-5 h-5" /> {errorMsg}
                </div>
              )}

              <form
                onSubmit={handleLookup}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                <div className="space-y-2 max-w-md mx-auto w-full text-center">
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">
                    Patient ID
                  </label>
                  <input
                    required
                    autoFocus
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    placeholder="e.g. 1120709496"
                    className="w-full px-4 py-4 text-center rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold text-lg text-slate-800"
                  />
                </div>
                <div className="pt-6 mt-auto">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70"
                  >
                    {isLoading ? "Searching..." : "Search Patient"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "patient_found" && (
            <div className="p-8 flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setStep("lookup")}
                  className="p-2 -ml-2 mr-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-6 h-6" />
                </button>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <FaHistory className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-black text-slate-800">
                    Patient Found
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    ID: {formData.patientId}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 mb-6 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {existingPatient?.fullName || "Patient Profile"}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  You can now proceed to register a new visit and predict MMSE.
                </p>
              </div>

              <div className="pt-2 mt-auto">
                <button
                  onClick={() => setStep("visit_info")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Register New Visit <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === "new_patient" && (
            <div className="p-8 flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setStep("lookup")}
                  className="p-2 -ml-2 mr-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-6 h-6" />
                </button>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <FaUserPlus className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-black text-slate-800">
                    New Patient Details
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Patient not found. Register a new profile.
                  </p>
                </div>
              </div>
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-bold flex items-center gap-2">
                  <FiAlertTriangle className="w-5 h-5" /> {errorMsg}
                </div>
              )}
              <form
                onSubmit={handleNewPatientNext}
                className="space-y-6 flex-1 flex flex-col"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ahmed Ali"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-slate-800"
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">
                      Education Years
                    </label>
                    <input
                      required
                      type="number"
                      name="educationYears"
                      min="0"
                      value={formData.educationYears}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div className="pt-6 mt-auto">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Next: Clinical Biomarkers <FaArrowRight />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "visit_info" && (
            <div className="p-5 flex flex-col animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="flex items-center mb-4">
                <button
                  onClick={() =>
                    setStep(existingPatient ? "patient_found" : "new_patient")
                  }
                  className="p-1.5 -ml-1.5 mr-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
                  <FaBrain className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-black text-slate-800">
                    Visit Biomarkers
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Record patient age and gene expression.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-bold flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              <div className="space-y-3 flex-1 overflow-y-auto pr-1.5 pb-2">
                <div className="bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4 mb-1">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      Age At Visit
                    </label>
                    <input
                      required
                      type="number"
                      name="ageAtVisit"
                      min="0"
                      step="1.0"
                      value={formData.ageAtVisit}
                      onChange={handleChange}
                      placeholder="e.g. 65"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      AQP7
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.AQP7)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "AQP7", value: String(val) },
                        } as any)
                      }
                      min={2.5}
                      max={5.5}
                      step={0.01}
                    />
                  </div>
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      RPS5
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.RPS5)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "RPS5", value: String(val) },
                        } as any)
                      }
                      min={9.5}
                      max={13.0}
                      step={0.01}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      CHD2
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.CHD2)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "CHD2", value: String(val) },
                        } as any)
                      }
                      min={6.0}
                      max={11.0}
                      step={0.01}
                    />
                  </div>
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      SNX5
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.SNX5)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "SNX5", value: String(val) },
                        } as any)
                      }
                      min={6.0}
                      max={10.0}
                      step={0.01}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      ASS1
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.ASS1)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "ASS1", value: String(val) },
                        } as any)
                      }
                      min={5.0}
                      max={10.0}
                      step={0.01}
                    />
                  </div>
                  <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4">
                    <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-2">
                      Unchar
                    </Label>
                    <DualRangeSlider
                      value={[Number(formData.Unchar)]}
                      onValueChange={([val]) =>
                        handleChange({
                          target: { name: "Unchar", value: String(val) },
                        } as any)
                      }
                      min={2.0}
                      max={7.0}
                      step={0.01}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 mt-auto">
                <button
                  disabled={isLoading}
                  onClick={handlePredictAndSave}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-md shadow-slate-900/20 disabled:opacity-70"
                >
                  {isLoading ? loadingText : "Predict MMSE & Save Visit"}
                </button>
              </div>
            </div>
          )}

          {/* 💡 [التصميم الجديد لصفحة النتيجة] */}
          {step === "result" && aiResultData && (
            <div
              ref={resultRef}
              className="p-8 flex flex-col h-full animate-in zoom-in-95 duration-500 overflow-y-auto"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <FaCircleCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">
                    AI Assessment Complete
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    Records successfully synced to database.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* بطاقة تقييم الـ MMSE */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -top-4 -right-4 p-4 opacity-10">
                    <FaBrain className="w-32 h-32" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 relative z-10">
                    {statusDetails.type.includes("delta") ? "Predicted Change (Delta)" : "Predicted MMSE Score"}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2 relative z-10">
                    <span
                      className={`text-6xl font-black ${statusDetails.color}`}
                    >
                      {/* عرض الإشارة للموجب إذا كان الفرق موجبًا */}
                      {statusDetails.type === "delta_positive" && finalScore > 0 ? "+" : ""}
                      {finalScore}
                    </span>
                    <span className="text-xl text-slate-400 font-bold">
                      {statusDetails.type.includes("delta") ? "pts" : "/30"}
                    </span>
                  </div>
                </div>

                {/* بطاقة الحالة والمخاطر */}
                <div className="bg-white border border-[#EAE5D9] p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Clinical Trend
                      </p>
                      {statusDetails.icon}
                    </div>
                    <div
                      className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${statusDetails.lightBg} ${statusDetails.color} ${statusDetails.border}`}
                    >
                      {statusDetails.label}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Patient ID
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {formData.patientId}
                    </p>
                  </div>
                </div>
              </div>

              {/* 💡 [شرح ديناميكي للطبيب يوضح معنى الرقم] */}
              <div className={`border rounded-2xl p-4 flex gap-3 items-start mb-6 ${
                finalScore < 0 
                  ? "bg-rose-50 border-rose-100 text-rose-800" 
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${finalScore < 0 ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                <div className="text-sm leading-relaxed font-medium">
                  <span className="font-bold block mb-1">Understanding the Prediction:</span>
                  {finalScore < 0 ? (
                    <>
                      The AI predicts a <span className="font-bold underline">decrease of {Math.abs(finalScore)} points</span> in the patient's MMSE. A negative score indicates a trend towards cognitive decline based on the patient's biomarker profile.
                    </>
                  ) : statusDetails.type.includes("delta") ? (
                    <>
                      The AI predicts stability or a slight improvement of <span className="font-bold">+{finalScore} points</span>. No significant cognitive decline is expected based on current biomarkers.
                    </>
                  ) : (
                    <>
                      The model processed the biomarkers and predicted an absolute MMSE score of <span className="font-bold">{finalScore}/30</span>, indicating {statusDetails.label.toLowerCase()}.
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  onClick={() => handleOpenChange(false)}
                  className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </CustomDrawer>
    </>
  );
}