"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  FaUserPlus,
  FaArrowRight,
  FaBrain,
  FaDna,
  FaClipboardList,
  FaHistory,
  FaSearch,
} from "react-icons/fa";
import {
  IoIosArrowBack,
  IoMdTrendingDown,
  IoMdTrendingUp,
} from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import CustomDrawer from "../../intro-disclosure";
import { DualRangeSlider } from "../../slider";
import { FaCircleCheck } from "react-icons/fa6";

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

const BIOMARKERS = [
  { id: "AQP7", label: "AQP7", min: 2.5, max: 5.5, step: 0.01 },
  { id: "RPS5", label: "RPS5", min: 9.5, max: 13.0, step: 0.01 },
  { id: "CHD2", label: "CHD2", min: 6.0, max: 11.0, step: 0.01 },
  { id: "SNX5", label: "SNX5", min: 6.0, max: 10.0, step: 0.01 },
  { id: "ASS1", label: "ASS1", min: 5.0, max: 10.0, step: 0.01 },
  { id: "Unchar", label: "chr12q15", min: 2.0, max: 7.0, step: 0.01 },
] as const;

const FormInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
  isHighlight = false,
}: any) => (
  <div className="space-y-1.5 flex-1">
    <label
      className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${
        isHighlight ? "text-emerald-600" : "text-slate-500"
      }`}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all font-medium text-slate-800 placeholder:font-medium placeholder:text-slate-400
        ${
          error
            ? "border-red-400 bg-red-50 focus:ring-red-100"
            : isHighlight
            ? "border-emerald-100 bg-emerald-50/30 focus:bg-white focus:ring-emerald-200 focus:border-emerald-400"
            : "border-slate-200 bg-white focus:ring-blue-100 focus:border-blue-400"
        } 
        focus:ring-2`}
    />
    {error && (
      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
        <FiAlertTriangle /> {error}
      </p>
    )}
  </div>
);

export default function AddPatientDrawer({ onSuccess }: AddPatientDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("lookup");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Predict MMSE & Save Visit");
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [aiResultData, setAiResultData] = useState<any>(null);
  const [calculatedFuture, setCalculatedFuture] = useState<number>(0);
  const [calculatedDelta, setCalculatedDelta] = useState<number>(0);
  const [existingPatient, setExistingPatient] = useState<any>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    fullName: "",
    gender: "1",
    educationYears: "",
    ageAtVisit: "",
    currentMmse: "",
    AQP7: "3.75",
    RPS5: "11.25",
    CHD2: "8.25",
    SNX5: "8.3",
    ASS1: "7.5",
    Unchar: "4.0",
  });

  const validateField = useCallback((name: string, value: string) => {
    let error = "";
    switch (name) {
      case "patientId":
        if (!/^\d+$/.test(value)) error = "Must contain only numbers.";
        break;
      case "fullName":
        if (!/^[\p{L}\s]{3,50}$/u.test(value))
          error = "Invalid name (letters only, 3-50 chars).";
        break;
      case "ageAtVisit":
        const age = Number(value);
        if (age < 18 || age > 120) error = "Age must be between 18 and 120.";
        break;
      case "educationYears":
        if (Number(value) < 0 || Number(value) > 40)
          error = "Invalid education years (0-40).";
        break;
      case "currentMmse":
        const mmse = Number(value);
        if (value === "" || mmse < 0 || mmse > 30)
          error = "MMSE must be between 0 and 30.";
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    },
    [validateField]
  );

  const handleSliderChange = useCallback((name: string, val: number) => {
    setFormData((prev) => ({ ...prev, [name]: String(val) }));
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateField("patientId", formData.patientId) || !formData.patientId)
      return;

    setIsLoading(true);
    setGlobalError("");
    setFieldErrors({});
    try {
      const res = await fetch(
        `/api/patients/search?patientId=${formData.patientId}`
      );
      if (res.ok) {
        const data = await res.json();
        setExistingPatient(data);
        setStep("patient_found");
        setFormData((prev) => ({ ...prev, currentMmse: "", ageAtVisit: "" }));
      } else if (res.status === 404) {
        setExistingPatient(null);
        setStep("new_patient");
      } else throw new Error("Failed to lookup patient.");
    } catch (error) {
      setExistingPatient(null);
      setStep("new_patient");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPatientNext = (e: React.FormEvent) => {
    e.preventDefault();
    const isNameValid = validateField("fullName", formData.fullName);
    const isAgeValid = validateField("ageAtVisit", formData.ageAtVisit);
    const isMmseValid = validateField("currentMmse", formData.currentMmse);

    if (!isNameValid || !isAgeValid || !isMmseValid) {
      setGlobalError("Please resolve field errors before continuing.");
      return;
    }
    setGlobalError("");
    setStep("visit_info");
  };

  const handlePredictAndSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAgeValid = validateField("ageAtVisit", formData.ageAtVisit);
    const isMmseValid = validateField("currentMmse", formData.currentMmse);
    if (!isAgeValid || !isMmseValid) return;

    setIsLoading(true);
    setGlobalError("");
    setAiResultData(null);

    let stepIndex = 0;
    setLoadingText(LOADING_STEPS[0]);
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 800);

    try {
      const geneExpressionArray = BIOMARKERS.map((b) =>
        Number(formData[b.id as keyof typeof formData])
      );

      const currentMmseValue = Number(formData.currentMmse);

      const aiResponse = await fetch(
        "https://neuro-cast-api.vercel.app/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_data: {
              age: Number(formData.ageAtVisit),
              gender: Number(existingPatient?.gender ?? formData.gender),
              educationYears:
                Number(
                  existingPatient?.educationYears ?? formData.educationYears
                ) || 0,
              current_mmse: currentMmseValue,
            },
            expression: geneExpressionArray,
            is_first_visit: step === "new_patient" || !existingPatient,
          }),
        }
      );

      const json = await aiResponse.json();
      if (!aiResponse.ok || json.error)
        throw new Error(json.error || "AI Prediction failed.");

      const futureFromModel = Math.abs(Number(json.predicted_delta_mmse) || 0);
      const calculatedDeltaScore = futureFromModel - currentMmseValue;

      const finalFuture = Math.max(
        0,
        Math.min(30, Math.round(futureFromModel * 10) / 10)
      );
      const finalDelta = Math.round(calculatedDeltaScore * 10) / 10;
      const riskCategory = json.risk_stratification?.category || "Unknown";

      setCalculatedFuture(finalFuture);
      setCalculatedDelta(finalDelta);
      setAiResultData(json);

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
          mmse: currentMmseValue,
          aqp7: parseFloat(formData.AQP7),
          rps5: parseFloat(formData.RPS5),
          chd2: parseFloat(formData.CHD2),
          snx5: parseFloat(formData.SNX5),
          ass1: parseFloat(formData.ASS1),
          unchar: parseFloat(formData.Unchar),
          futureMmse: finalFuture,
          prediction: riskCategory,
          confidence: json.model_info?.loocv_mae || null,
        },
      };

      const dbRes = await fetch("/api/patients/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      if (!dbRes.ok)
        console.warn("Prediction succeeded, but failed to save in Database.");

      clearInterval(interval);
      setStep("result");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      clearInterval(interval);
      setGlobalError(error.message || "Connection Error. Please try again.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setLoadingText("Predict MMSE & Save Visit");
    }
  };

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("lookup");
        setAiResultData(null);
        setGlobalError("");
        setFieldErrors({});
        setExistingPatient(null);
        setFormData({
          patientId: "",
          fullName: "",
          gender: "1",
          educationYears: "",
          ageAtVisit: "",
          currentMmse: "",
          AQP7: "3.75",
          RPS5: "11.25",
          CHD2: "8.25",
          SNX5: "8.3",
          ASS1: "7.5",
          Unchar: "4.0",
        });
      }, 300);
    }
  }, []);

  const progressWidth = useMemo(() => {
    const map: Record<Step, string> = {
      lookup: "25%",
      patient_found: "50%",
      new_patient: "50%",
      visit_info: "75%",
      result: "100%",
    };
    return map[step];
  }, [step]);

  const riskColorCode = aiResultData?.risk_stratification?.color || "#64748b";
  const deltaStatus = useMemo(() => {
    if (calculatedDelta < -2)
      return {
        bg: "bg-rose-50 border-rose-200",
        text: "text-rose-600",
        Icon: IoMdTrendingDown,
      };
    if (calculatedDelta < 0)
      return {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-600",
        Icon: IoMdTrendingDown,
      };
    return {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-600",
      Icon: IoMdTrendingUp,
    };
  }, [calculatedDelta]);

  const dynamicRisk = useMemo(() => {
    if (calculatedDelta <= -2) {
      return {
        category: "High Risk - Rapid Decline",
        description:
          "Significant cognitive decline predicted. Immediate clinical intervention and comprehensive neurological evaluation are strongly recommended.",
        monitoring: "Schedule follow-up within 1-3 months.",
        color: "#e11d48",
      };
    } else if (calculatedDelta < 0) {
      return {
        category: "Moderate Risk - Mild Decline",
        description:
          "Mild cognitive deterioration expected. Close observation and lifestyle/therapeutic adjustments should be considered.",
        monitoring: "Schedule follow-up within 3-6 months.",
        color: "#d97706",
      };
    } else {
      return {
        category: "Low Risk - Stable",
        description:
          "Cognitive function is predicted to remain stable or improve. Continue current care plan.",
        monitoring: "Standard follow-up in 6-12 months.",
        color: "#059669",
      };
    }
  }, [calculatedDelta]);
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
        <div className="w-full mx-auto min-h-screen flex flex-col overflow-hidden relative z-[9999] rounded-3xl bg-[#FDFBF7] border border-[#EAE5D9] shadow-2xl">
          <div className="flex bg-slate-100 h-1.5 w-full">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
              style={{ width: progressWidth }}
            />
          </div>

          {/* STEP 1: LOOKUP */}
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
              {globalError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-bold flex items-center gap-2 animate-in zoom-in-95">
                  <FiAlertTriangle className="w-5 h-5" /> {globalError}
                </div>
              )}
              <form
                onSubmit={handleLookup}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                <div className="max-w-md mx-auto w-full text-center">
                  <FormInput
                    label="Patient ID"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    error={fieldErrors.patientId}
                    placeholder="e.g. 1120709496"
                    required
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

          {/* STEP 2: PATIENT FOUND */}
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
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {existingPatient?.fullName || "Patient Profile"}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Record located. Please proceed to log the new clinical
                  assessment for today's visit.
                </p>
              </div>
              <div className="pt-2 mt-auto">
                <button
                  onClick={() => setStep("visit_info")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Log New Visit <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: NEW PATIENT */}
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
                    New Patient
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Register profile and baseline assessment.
                  </p>
                </div>
              </div>
              {globalError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-bold flex items-center gap-2">
                  <FiAlertTriangle className="w-5 h-5" /> {globalError}
                </div>
              )}

              <form
                onSubmit={handleNewPatientNext}
                className="space-y-6 flex-1 flex flex-col"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-y-auto pr-2 pb-2">
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      error={fieldErrors.fullName}
                      placeholder="e.g. Ahmed Ali"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
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
                  <FormInput
                    label="Education Years"
                    name="educationYears"
                    type="number"
                    value={formData.educationYears}
                    onChange={handleChange}
                    error={fieldErrors.educationYears}
                    placeholder="e.g. 12"
                  />
                  <FormInput
                    label="Current Age"
                    name="ageAtVisit"
                    type="number"
                    value={formData.ageAtVisit}
                    onChange={handleChange}
                    error={fieldErrors.ageAtVisit}
                    placeholder="e.g. 65"
                    required
                  />
                  <FormInput
                    label="Base MMSE Score"
                    name="currentMmse"
                    type="number"
                    value={formData.currentMmse}
                    onChange={handleChange}
                    error={fieldErrors.currentMmse}
                    placeholder="e.g. 26"
                    required
                    isHighlight
                  />
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

          {/* STEP 4: VISIT INFO (BIOMARKERS) */}
          {step === "visit_info" && (
            <div className="p-5 flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-500">
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
                    Log today's assessment and adjust gene sliders.
                  </p>
                </div>
              </div>
              {globalError && (
                <div className="mb-3 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-bold flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" /> {globalError}
                </div>
              )}

              <div className="space-y-3 flex-1 overflow-y-auto pr-1.5 pb-2">
                {existingPatient && (
                  <div className="bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4 mb-2 flex flex-col sm:flex-row gap-4">
                    <FormInput
                      label="Age At This Visit"
                      name="ageAtVisit"
                      type="number"
                      value={formData.ageAtVisit}
                      onChange={handleChange}
                      error={fieldErrors.ageAtVisit}
                      placeholder="e.g. 66"
                      required
                    />
                    <FormInput
                      label="Today's MMSE Score"
                      name="currentMmse"
                      type="number"
                      value={formData.currentMmse}
                      onChange={handleChange}
                      error={fieldErrors.currentMmse}
                      placeholder={
                        existingPatient.latestMmse
                          ? `e.g. 24 (Last: ${existingPatient.latestMmse})`
                          : "e.g. 24"
                      }
                      required
                      isHighlight
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BIOMARKERS.map(({ id, label, min, max, step }) => (
                    <div
                      key={id}
                      className="bg-white border border-[#EAE5D9] shadow-sm rounded-2xl p-4 hover:border-blue-200 transition-colors"
                    >
                      <Label className="block text-[11px] font-bold text-slate-600 tracking-wider uppercase mb-3 justify-between">
                        {label}{" "}
                        <span className="text-blue-600 bg-blue-50 px-1.5 rounded">
                          {Number(
                            formData[id as keyof typeof formData]
                          ).toFixed(2)}
                        </span>
                      </Label>
                      <DualRangeSlider
                        value={[Number(formData[id as keyof typeof formData])]}
                        onValueChange={([val]) => handleSliderChange(id, val)}
                        min={min}
                        max={max}
                        step={step}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  disabled={isLoading}
                  onClick={handlePredictAndSave}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black transition-all shadow-md shadow-slate-900/20 disabled:opacity-70 disabled:scale-95 duration-300"
                >
                  {isLoading ? loadingText : "Predict MMSE & Save Visit"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RESULT */}
          {step === "result" && aiResultData && (
            <div
              ref={resultRef}
              className="p-6 flex flex-col h-full animate-in zoom-in-95 duration-500 overflow-y-auto w-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <FaCircleCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    Assessment Complete
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    Visit successfully logged in patient records.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white border border-[#EAE5D9] p-4 rounded-2xl shadow-sm text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Today's Score
                  </p>
                  <p className="text-2xl font-black text-slate-700">
                    {formData.currentMmse}
                    <span className="text-sm text-slate-400">/30</span>
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md text-center relative overflow-hidden group">
                  <FaBrain className="absolute -right-2 -bottom-2 text-white/5 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1 relative z-10">
                    AI Prediction
                  </p>
                  <p className="text-2xl font-black text-white relative z-10">
                    {calculatedFuture}
                    <span className="text-sm text-slate-400">/30</span>
                  </p>
                </div>

                <div
                  className={`${deltaStatus.bg} border p-4 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center transition-colors duration-500`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Delta Change
                  </p>
                  <div className="flex items-center gap-1">
                    <deltaStatus.Icon
                      className={`w-5 h-5 ${deltaStatus.text}`}
                    />
                    <p className={`text-xl font-black ${deltaStatus.text}`}>
                      {calculatedDelta > 0 ? "+" : ""}
                      {calculatedDelta}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="border p-5 rounded-2xl mb-6 shadow-inner transition-colors duration-500"
                style={{
                  borderColor: dynamicRisk.color,
                  backgroundColor: `${dynamicRisk.color}10`,
                }}
              >
                <h4
                  className="font-bold mb-2 flex items-center gap-2 text-sm"
                  style={{ color: dynamicRisk.color }}
                >
                  <FaClipboardList className="w-4 h-4" />
                  Risk Category: {dynamicRisk.category}
                </h4>
                <p className="text-sm font-medium text-slate-800 leading-relaxed mix-blend-color-burn">
                  {dynamicRisk.description}
                </p>
                <div
                  className="mt-4 inline-flex px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border text-xs font-bold shadow-sm"
                  style={{
                    borderColor: `${dynamicRisk.color}40`,
                    color: dynamicRisk.color,
                  }}
                >
                  Follow-up: {dynamicRisk.monitoring}
                </div>
              </div>

              <div className="bg-white border border-[#EAE5D9] p-5 rounded-2xl shadow-sm mb-6">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                  <FaDna className="w-4 h-4 text-indigo-500" /> Biomarker
                  Expression Overview
                </h4>
                <div className="space-y-4">
                  {BIOMARKERS.map((gene) => {
                    const val = Number(
                      formData[gene.id as keyof typeof formData]
                    );
                    const percentage = Math.max(
                      0,
                      Math.min(
                        100,
                        ((val - gene.min) / (gene.max - gene.min)) * 100
                      )
                    );
                    const barColor =
                      percentage > 85
                        ? "bg-rose-500"
                        : percentage < 15
                        ? "bg-amber-500"
                        : "bg-indigo-500";

                    return (
                      <div key={gene.id} className="group">
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                            {gene.label}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {val.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`${barColor} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => handleOpenChange(false)}
                  className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm"
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
