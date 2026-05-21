"use client";
import React, { useState, useRef } from "react";
import { Label } from "@radix-ui/react-label";
// قمنا بإضافة أيقونة الرجوع هنا
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"; 
import { DualRangeSlider } from "../../slider";
import { PredictionResult } from "../../../../../types/clinical";
import ClinicalReport from "@/components/clinical/ClinicalReport";

const LOADING_STEPS = [
  "Normalizing Microarray Data...",
  "Applying Deep Feature Extraction...",
  "Calculating SHAP Contributions...",
  "Stratifying Longitudinal Risk...",
  "Finalizing Clinical Report...",
];

// 1. تعريف الـ Props لاستقبال دالة الرجوع
interface GuestFormProps {
  onBackToLogin: () => void;
}

// 2. تمرير الـ Props للمكون
export default function GuestForm({ onBackToLogin }: GuestFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    patient_id: "GUEST_DEMO",
    fullName: "Guest User",
    age: "65",
    gender: "1",
    education_years: "12",
    mmse: "28",
    cdrsb: "0.5",
    hippocampus_vol: "6500",
    abeta: "800",
    tau: "250",
    AQP7: 3.75,
    RPS5: 11.25,
    CHD2: 8.25,
    SNX5: 8.3,
    ASS1: 7.5,
    Unchar: 4.0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        Number(formData.AQP7),
        Number(formData.RPS5),
        Number(formData.CHD2),
        Number(formData.SNX5),
        Number(formData.ASS1),
        Number(formData.Unchar),
      ];

      const aiResponse = await fetch("https://neuro-cast-api.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_data: formData,
          expression: geneExpressionArray,
          is_first_visit: true,
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
      
      {/* 3. زر الرجوع إلى صفحة تسجيل الدخول */}
      <div className="w-full max-w-2xl mx-auto mb-4 flex justify-start no-print" dir="ltr">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
        >
          <IoIosArrowBack className="w-4 h-4" />
          Exit Demo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-start w-full max-w-2xl mx-auto">
        
        {/* ترويسة بسيطة لتوضيح أنه وضع تجريبي */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-6">
          <h2 className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-1">
            Demo Mode (Guest)
          </h2>
          <p className="text-emerald-700/80 text-xs leading-relaxed">
            Adjust the gene expression sliders below to test the AI model&apos;s predictive capabilities. No patient data is saved in this mode.
          </p>
        </div>

        {/* --- مؤشرات الجينات (Sliders) --- */}
        <div className="space-y-6 animate-in fade-in duration-700 no-print">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Gene Expression Levels
            </h3>
            <p className="text-sm text-slate-500">
              Interactive sandbox to simulate different biomarker inputs.
            </p>
          </div>

          {/* الصف الأول */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                AQP7 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11762936_x_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.AQP7) || 3.75]}
                onValueChange={([val]) => handleChange({ target: { name: "AQP7", value: String(val) } } as any)}
                min={1.0} max={7.0} step={0.01} tickCount={31}
              />
            </div>
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                RPS5 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(200024_PM_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.RPS5) || 11.25]}
                onValueChange={([val]) => handleChange({ target: { name: "RPS5", value: String(val) } } as any)}
                min={8.0} max={15.0} step={0.01} tickCount={31}
              />
            </div>
          </div>

          {/* الصف الثاني */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                CHD2 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11762358_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.CHD2) || 8.25]}
                onValueChange={([val]) => handleChange({ target: { name: "CHD2", value: String(val) } } as any)}
                min={3.0} max={12.0} step={0.01} tickCount={31}
              />
            </div>
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                SNX5 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11763188_a_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.SNX5) || 8.3]}
                onValueChange={([val]) => handleChange({ target: { name: "SNX5", value: String(val) } } as any)}
                min={5.0} max={12.0} step={0.01} tickCount={31}
              />
            </div>
          </div>

          {/* الصف الثالث */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                ASS1 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11757278_x_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.ASS1) || 7.5]}
                onValueChange={([val]) => handleChange({ target: { name: "ASS1", value: String(val) } } as any)}
                min={4.0} max={11.0} step={0.01} tickCount={31}
              />
            </div>
            <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
              <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">
                Unchar <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11764118_at)</span>
              </Label>
              <DualRangeSlider
                value={[Number(formData.Unchar) || 4.0]}
                onValueChange={([val]) => handleChange({ target: { name: "Unchar", value: String(val) } } as any)}
                min={1.0} max={8.0} step={0.01} tickCount={31}
              />
            </div>
          </div>
        </div>
        {/* --- نهاية مؤشرات الجينات --- */}

        {/* زر إرسال الطلب للذكاء الاصطناعي */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30 transition-all h-16 mt-8 relative overflow-hidden group disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3 w-full">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span className="font-mono text-sm animate-pulse">{loadingText}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Test AI Model <IoIosArrowForward className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>

        {/* قسم عرض النتيجة */}
        {result && <ClinicalReport result={result} resultRef={resultRef} />}
        
      </form>
    </div>
  );
}