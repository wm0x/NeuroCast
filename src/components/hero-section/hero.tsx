"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import React, { useState, useEffect, useRef } from "react"; // تأكد من إضافة useRef

import CallToAction from "./top-button";
import { ScrollToExplore } from "./ScrollToExplore";
import NeumorphButton from "../ui/neumorph-button";
import { IoIosArrowForward } from "react-icons/io";
import { FiPrinter, FiDownload } from "react-icons/fi"; // أيقونات جديدة للتقرير
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "../ui/expandable-screen";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { DualRangeSlider } from "../ui/slider";

// --- Interfaces ---
interface PredictionResult {
  predicted_delta_mmse: number;
  composite_risk_score: number;
  risk_stratification: {
    category: string;
    code: string;
    color: string;
    description: string;
    monitoring: string;
    threshold: string;
  };
  gene_contributions: {
    symbol: string;
    contribution: number;
    weight: number;
    expression: number;
  }[];
  model_info: {
    loocv_mae: number;
    training_cohort: string;
  };
  status?: string;
}
interface VisitRecord {
  id: string;
  visitDate: string;
  ageAtVisit: number;
  mmse: number;
  cdrsb: number;
  hippocampusVol: number;
  prediction: string;
}

// نصوص التحميل لمحاكاة تفكير الذكاء الاصطناعي
const LOADING_STEPS = [
  "Normalizing Microarray Data...",
  "Applying Deep Feature Extraction...",
  "Calculating SHAP Contributions...",
  "Stratifying Longitudinal Risk...",
  "Finalizing Clinical Report..."
];

export default function Hero() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]); // حالة نص التحميل
  const [isVerified, setIsVerified] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [pastVisits, setPastVisits] = useState<VisitRecord[]>([]);
  const resultRef = useRef<HTMLDivElement>(null); // ref جديد

  const [formData, setFormData] = useState({
    patient_id: "",
    fullName: "",
    age: "",
    gender: "",
    education_years: "",
    mmse: "",
    cdrsb: "",
    hippocampus_vol: "",
    abeta: "",
    tau: "",
    AQP7: 3.75,
    RPS5: 11.25,
    CHD2: 8.25,
    SNX5: 8.3,
    ASS1: 7.5,
    Unchar: 4.0,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // مسح النتيجة القديمة عند بدء تحليل جديد

    // محاكاة خطوات الذكاء الاصطناعي (Wow Factor)
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % LOADING_STEPS.length;
      setLoadingText(LOADING_STEPS[stepIndex]);
    }, 800);

    try {
      // ─── تم إزالة كود حفظ الزيارة في الداتابيز (save-visit) ───

      const geneExpressionArray = [
        Number(formData.AQP7), Number(formData.RPS5), Number(formData.CHD2),
        Number(formData.SNX5), Number(formData.ASS1), Number(formData.Unchar),
      ];

      // 💡 تذكير: تأكد أن الرابط هنا هو رابط Vercel الخاص بالباك إند إذا كنت سترفعه للإنترنت
      // بدلاً من 127.0.0.1
      const aiResponse = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_data: formData,
          expression: geneExpressionArray,
          is_first_visit: isNewPatient,
        }),
      });

      const json = await aiResponse.json();
      clearInterval(interval); // إيقاف تأثير النصوص

      if (!aiResponse.ok) {
        alert(json.error || "Prediction failed.");
        setLoading(false);
        return;
      }
      
      // تأخير بسيط لإعطاء تأثير سينمائي قبل عرض النتيجة
      setTimeout(() => {
        setResult(json);
        setLoading(false);
        // التمرير التلقائي للنتيجة
        if (resultRef.current) {
          resultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
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
    <div className="relative flex flex-col min-h-screen items-center justify-center px-10 bg-black w-full rounded-2xl mt-10 pb-32">
      {/* ستايل مخصص للطباعة (يخفي كل شيء ما عدا النتيجة) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}} />

      <CallToAction />

      <div className="text-white mt-10 text-4xl text-center items-center">
        Empowering Early Alzheimer’s Detection with AI
        <span className="flex mt-5 text-xl text-neutral-400 justify-center">
          Leveraging advanced deep learning algorithms to predict and analyze
          Alzheimer&apos;s trajectory.
        </span>
        <div className="mt-10 items-center justify-center flex flex-row w-full">
          <ExpandableScreen layoutId="cta-card" triggerRadius="100px" contentRadius="32px">
            <ExpandableScreenTrigger>
              <NeumorphButton intent="secondary" className="cursor-pointer flex flex-row shadow-lg hover:shadow-xl transition-all">
                Access Clinical System <IoIosArrowForward className="inline size-5 mb-0.5 ml-2" />
              </NeumorphButton>
            </ExpandableScreenTrigger>

            <ExpandableScreenContent className="bg-[#FDFBF7] shadow-2xl border border-[#EAE5D9]">
              <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto items-start">
                
                {/* ─── الجانب الأيسر: العنوان الرئيسي ─── */}
                <div className="w-full lg:flex-1 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-6 lg:p-12 z-20 text-slate-800 max-w-2xl mx-auto no-print">
                  <div className="flex flex-col items-start justify-center gap-6 mb-8 mx-auto">
                    <img src="/logo.png" alt="NeuroCast" className="h-12 object-contain grayscale items-center justify-center flex opacity-80" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-slate-900 mb-10">
                    Predicting the Course of <br />
                    <span className="text-blue-600">Alzheimer&apos;s</span>
                  </h2>

                  {/* Metrics Grid */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">LOOCV MAE</span>
                        <span className="text-2xl font-bold text-slate-800">1.388</span>
                      </div>
                      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">LOOCV R²</span>
                        <span className="text-2xl font-bold text-slate-800">0.247</span>
                      </div>
                      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Training n</span>
                        <span className="text-2xl font-bold text-slate-800">96</span>
                      </div>
                    </div>

                    {/* Six-Probe Panel Summary */}
                    <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl overflow-hidden flex flex-col text-2xl">
                      <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">🧬 Six-Probe Panel</h3>
                        <div className="flex gap-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider ">
                          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Harmful</span>
                          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Protective</span>
                        </div>
                      </div>

                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* AQP7 */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-red-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">AQP7</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">Aquaporin 7</span>
                            </div>
                          </div>
                          <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">-0.598</div>
                        </div>

                        {/* RPS5 */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-red-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">RPS5</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">Ribosomal Protein</span>
                            </div>
                          </div>
                          <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">-0.447</div>
                        </div>

                        {/* CHD2 */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-red-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">CHD2</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">Chromodomain</span>
                            </div>
                          </div>
                          <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">-0.293</div>
                        </div>

                        {/* SNX5 */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-emerald-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">SNX5</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">Sorting Nexin 5</span>
                            </div>
                          </div>
                          <div className="bg-emerald-50 text-emerald-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">+0.441</div>
                        </div>

                        {/* ASS1 */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-red-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">ASS1</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">Argininosuccinate</span>
                            </div>
                          </div>
                          <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">-0.328</div>
                        </div>

                        {/* Unchar */}
                        <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-2.5">
                            <div className="w-1 h-8 rounded-full bg-red-400" />
                            <div className="flex flex-col">
                              <span className="font-mono text-xs font-bold text-slate-800">Unchar</span>
                              <span className="text-[9px] text-slate-400 truncate max-w-[80px]">chr12q15</span>
                            </div>
                          </div>
                          <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">-0.462</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inline-flex items-start gap-3 p-3 mt-5 mx-auto bg-amber-50/80 border border-amber-200/60 rounded-xl max-w-md">
                    <div>
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-0.5">
                        Research Prototype Disclaimer
                      </p>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed">
                        Not validated for clinical use. Trained on ADNI-GO (n=96).
                        <strong className="font-bold text-amber-900 ml-1">Do not use for clinical decisions.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── الجانب الأيمن: نموذج الإدخال والنتائج ─── */}
                <div className="w-full lg:flex-1 p-6 sm:p-10 lg:p-16 lg:min-h-screen flex flex-col justify-center border-l border-[#EAE5D9]">
                  <form onSubmit={handleSubmit} className="space-y-8 text-start w-full max-w-2xl mx-auto">
                    
                    {/* Patient ID */}
                    {/* <div className="bg-white p-6 rounded-3xl border border-[#EAE5D9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] no-print">
                      <Label className="block text-[10px] font-bold mb-4 tracking-widest uppercase text-slate-400">
                        PATIENT IDENTIFICATION *
                      </Label>
                      <div className="flex gap-3">
                        <input
                          type="text" name="patient_id" required value={formData.patient_id} onChange={handleChange}
                          placeholder="e.g. RID_1234"
                          className="flex-1 px-5 py-3.5 text-slate-900 rounded-2xl bg-[#FDFBF7] border border-[#EAE5D9] focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                        />
                        <button
                          type="button" onClick={handleVerifyID}
                          className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 hover:shadow-lg transition-all"
                        >
                          Verify
                        </button>
                      </div>
                      {isVerified && isNewPatient && (
                        <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl animate-in slide-in-from-top-2 fade-in">
                          <Label className="block text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-3">NEW RECORD: FULL NAME *</Label>
                          <input
                            type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                            placeholder="Enter patient full name"
                            className="w-full px-5 py-3 text-slate-900 rounded-xl bg-white border border-amber-200 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                          />
                        </div>
                      )}
                    </div> */}

                    {/* Genes Sliders */}
                    {!isVerified && (
                      <div className="space-y-6 pt-4 animate-in fade-in duration-700 no-print">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">Gene Expression Levels</h3>
                          <p className="text-sm text-slate-500">Adjust the biological markers based on the recent lab results.</p>
                        </div>
                        {/* صف 1 */}
                        <div className="flex flex-col sm:flex-row gap-5">
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">AQP7 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11762936_x_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.AQP7) || 3.75]} onValueChange={([val]) => handleChange({ target: { name: "AQP7", value: String(val) } } as any)} min={1.0} max={7.0} step={0.01} tickCount={31}/>
                          </div>
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">RPS5 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(200024_PM_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.RPS5) || 11.25]} onValueChange={([val]) => handleChange({ target: { name: "RPS5", value: String(val) } } as any)} min={8.0} max={15.0} step={0.01} tickCount={31}/>
                          </div>
                        </div>
                        {/* صف 2 */}
                        <div className="flex flex-col sm:flex-row gap-5">
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">CHD2 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11762358_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.CHD2) || 8.25]} onValueChange={([val]) => handleChange({ target: { name: "CHD2", value: String(val) } } as any)} min={3.0} max={12.0} step={0.01} tickCount={31}/>
                          </div>
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">SNX5 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11763188_a_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.SNX5) || 8.3]} onValueChange={([val]) => handleChange({ target: { name: "SNX5", value: String(val) } } as any)} min={5.0} max={12.0} step={0.01} tickCount={31}/>
                          </div>
                        </div>
                        {/* صف 3 */}
                        <div className="flex flex-col sm:flex-row gap-5">
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">ASS1 <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11757278_x_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.ASS1) || 7.5]} onValueChange={([val]) => handleChange({ target: { name: "ASS1", value: String(val) } } as any)} min={4.0} max={11.0} step={0.01} tickCount={31}/>
                          </div>
                          <div className="flex-1 bg-white border border-[#EAE5D9] shadow-sm rounded-3xl p-5 hover:shadow-md transition-shadow">
                            <Label className="block text-xs font-bold text-slate-600 tracking-wider uppercase mb-3">Unchar <span className="text-[10px] text-slate-400 lowercase ml-1 font-normal">(11764118_at)</span></Label>
                            <DualRangeSlider value={[Number(formData.Unchar) || 4.0]} onValueChange={([val]) => handleChange({ target: { name: "Unchar", value: String(val) } } as any)} min={1.0} max={8.0} step={0.01} tickCount={31}/>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all h-16 mt-8 relative overflow-hidden group"
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-3 w-full">
                              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                              <span className="font-mono text-sm animate-pulse">{loadingText}</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Run Multimodal AI Analysis <IoIosArrowForward className="group-hover:translate-x-1 transition-transform"/>
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* 🏆 THE WOW FACTOR: RESULT SECTION 🏆 */}
                    {result && (
            <div ref={resultRef} className="print-section space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 mt-10">
                        {/* Header with Print Button */}
                        <div className="flex justify-between items-center no-print">
                          <h2 className="text-2xl font-bold text-slate-800">Clinical AI Report</h2>
                        </div>

                        {/* البطاقة تشع بوهج ديناميكي بناءً على لون الخطورة */}
                        <div 
                          className="bg-white border p-6 sm:p-8 rounded-[2rem] relative overflow-hidden transition-all duration-1000"
                          style={{ 
                            borderColor: result.risk_stratification.color, 
                            boxShadow: `0 20px 50px -10px ${result.risk_stratification.color}30` 
                          }}
                        >
                          {/* تأثير بصري في الخلفية (Watermark) */}
                          <div 
                            className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                            style={{ backgroundColor: result.risk_stratification.color }}
                          />

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: result.risk_stratification.color }}/>
                                <Label className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">Risk Stratification</Label>
                              </div>
                              <h3 className="font-black text-4xl sm:text-5xl tracking-tight" style={{ color: result.risk_stratification.color }}>
                                {result.risk_stratification.category}
                              </h3>
                            </div>
                            
                            <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-right min-w-[140px]">
                              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Estimated ΔMMSE</span>
                              <span className="text-3xl font-bold text-slate-800 font-mono tracking-tighter">
                                {result.predicted_delta_mmse}
                              </span>
                            </div>
                          </div>

                          <div className="mt-8 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                            <p className="text-slate-700 font-medium leading-relaxed flex items-start gap-3">
                              <span className="text-xl">💡</span>
                              {result.risk_stratification.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200">
                              <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">Review Cycle:</span> 
                              {result.risk_stratification.monitoring}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white px-4 py-2 rounded-xl border border-slate-200" style={{ color: result.risk_stratification.color }}>
                              <span className="text-slate-400 uppercase text-[10px] tracking-wider font-sans">Model Confidence (MAE):</span> 
                              {result.model_info?.loocv_mae || "1.38"}
                            </div>
                          </div>
                        </div>

                        {/* الرسم البياني XAI */}
                        {result?.gene_contributions && (
                          <div className="bg-white border border-[#EAE5D9] shadow-sm p-6 sm:p-8 rounded-[2rem]">
                            <div className="flex justify-between items-center mb-8">
                              <Label className="block text-xs font-bold tracking-widest uppercase text-slate-500">
                                Explainable AI (SHAP Contributions)
                              </Label>
                            </div>
                            <div className="h-72 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={result?.gene_contributions} layout="vertical" margin={{ left: -20, right: 10 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                                  <XAxis type="number" hide />
                                  <YAxis dataKey="symbol" type="category" stroke="#94A3B8" fontSize={12} fontFamily="monospace" tickLine={false} axisLine={false} />
                                  <Tooltip
                                    cursor={{ fill: "#F8FAFC" }}
                                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: "16px", fontSize: "13px", fontWeight: "500", color: "#1E293B", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                  />
                                  <Bar dataKey="contribution" radius={[0, 8, 8, 0]} barSize={24}>
                                    {result?.gene_contributions?.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.contribution < 0 ? "#EF4444" : "#10B981"} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-50">
                               <span className="flex items-center gap-2 text-xs font-medium text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> Drives Decline (Harmful)</span>
                               <span className="flex items-center gap-2 text-xs font-medium text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/> Protects Cognition (Protective)</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </ExpandableScreenContent>
          </ExpandableScreen>
        </div>
      </div>
      <ScrollToExplore />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}