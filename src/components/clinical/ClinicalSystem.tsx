"use client";
import React, { useState, useRef } from "react";
import ClinicalReport from "./ClinicalReport";
import { PredictionResult, VisitRecord } from "../../../types/clinical";
import { Label } from "@radix-ui/react-label";
import { IoIosArrowForward } from "react-icons/io";

const LOADING_STEPS = [
  "Normalizing Microarray Data...",
  "Applying Deep Feature Extraction...",
  "Calculating SHAP Contributions...",
  "Stratifying Longitudinal Risk...",
  "Finalizing Clinical Report...",
];

export default function ClinicalSystem() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
  const [isVerified, setIsVerified] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [pastVisits, setPastVisits] = useState<VisitRecord[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patient_id: "", fullName: "", age: "", gender: "", education_years: "", mmse: "",
    cdrsb: "", hippocampus_vol: "", abeta: "", tau: "",
    AQP7: 3.75, RPS5: 11.25, CHD2: 8.25, SNX5: 8.3, ASS1: 7.5, Unchar: 4.0,
  });

  // 1. إضافة دالة التحديث التي كانت مفقودة
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. إضافة دالة التحقق من المريض
  const handleVerifyID = async () => {
    if (!formData.patient_id) {
      alert("Please enter a Patient ID first.");
      return;
    }
    setLoading(true);
    setLoadingText("Searching EHR Database...");
    try {
      const response = await fetch(`/api/patients/search?id=${formData.patient_id}`);
      const data = await response.json();

      if (data.exists) {
        setFormData((prev) => ({
          ...prev,
          fullName: data.data.fullName,
          gender: data.data.gender.toString(),
          education_years: data.data.educationYears?.toString() || "",
        }));
        setPastVisits(data.data.visits || []);
        setIsNewPatient(false);
      } else {
        setIsNewPatient(true);
        setPastVisits([]);
      }
      setIsVerified(true);
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 800);

    try {
      const geneExpressionArray = [
        Number(formData.AQP7), Number(formData.RPS5), Number(formData.CHD2),
        Number(formData.SNX5), Number(formData.ASS1), Number(formData.Unchar),
      ];

      const aiResponse = await fetch("https://neuro-cast-api.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_data: formData,
          expression: geneExpressionArray,
          is_first_visit: isNewPatient,
        }),
      });

      const json = await aiResponse.json();
      clearInterval(interval);

      if (!aiResponse.ok) {
        alert(json.error || "Prediction failed.");
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setResult(json);
        setLoading(false);
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } catch (error) {
      clearInterval(interval);
      console.error("Error:", error);
      alert("AI Server Connection Failed.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:flex-1 p-6 sm:p-10 lg:p-16 lg:min-h-screen flex flex-col justify-center border-l border-[#EAE5D9]">
      <form onSubmit={handleSubmit} className="space-y-8 text-start w-full max-w-2xl mx-auto">
        
        {/* قسم التحقق من المريض */}


        {/* يمكنك إعادة مكونات الجينات (Sliders) هنا داخل هذا الشرط لو أردت */}
        {/* {!isVerified && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-700 no-print">
            ... Sliders ...
          </div>
        )} */}

        {/* زر إرسال الطلب للذكاء الاصطناعي (كان مفقوداً) */}
        <button
          type="submit"
          disabled={loading || !isVerified}
          className="w-full px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all h-16 mt-8 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3 w-full">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span className="font-mono text-sm animate-pulse">{loadingText}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Run Multimodal AI Analysis <IoIosArrowForward className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>

        {/* قسم عرض النتيجة */}
        {result && <ClinicalReport result={result} resultRef={resultRef} />}
        
      </form>
    </div>
  );
}