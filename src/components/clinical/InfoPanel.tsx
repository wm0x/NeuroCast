import React from "react";

export default function InfoPanel() {
  return (
    <div className="w-full lg:flex-1 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-6 lg:p-12 z-20 text-slate-800 max-w-2xl mx-auto no-print">
      <div className="flex flex-col items-start justify-center gap-6 mb-8 mx-auto">
        <img
          src="/logo.png"
          alt="NeuroCast"
          className="h-12 object-contain grayscale items-center justify-center flex opacity-80"
        />
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-slate-900 mb-10">
        Predicting the Course of <br />
        <span className="text-blue-600">Alzheimer&apos;s</span>
      </h2>

      <div className="space-y-4">
        {/* إحصائيات النموذج */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              LOOCV MAE
            </span>
            <span className="text-2xl font-bold text-slate-800">1.388</span>
          </div>
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              LOOCV R²
            </span>
            <span className="text-2xl font-bold text-slate-800">0.247</span>
          </div>
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Training n
            </span>
            <span className="text-2xl font-bold text-slate-800">96</span>
          </div>
        </div>

        {/* لوحة الجينات */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-3xl overflow-hidden flex flex-col text-2xl">
          <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">
              🧬 Six-Probe Panel
            </h3>
            <div className="flex gap-3 text-[9px] font-medium text-slate-400 uppercase tracking-wider ">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Harmful
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Protective
              </span>
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
              <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                -0.598
              </div>
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
              <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                -0.447
              </div>
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
              <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                -0.293
              </div>
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
              <div className="bg-emerald-50 text-emerald-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                +0.441
              </div>
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
              <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                -0.328
              </div>
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
              <div className="bg-red-50 text-red-600 font-mono text-[10px] font-bold px-2 py-1 rounded-md">
                -0.462
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
              <strong className="font-bold text-amber-900 ml-1">
                Do not use for clinical decisions.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}