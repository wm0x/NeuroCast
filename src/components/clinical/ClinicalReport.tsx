"use client";
import React from "react";
import { Label } from "@radix-ui/react-label";
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
import { PredictionResult } from "../../../types/clinical";

interface Props {
  result: PredictionResult;
  resultRef: React.Ref<HTMLDivElement>;
}

export default function ClinicalReport({ result, resultRef }: Props) {
  if (!result) return null;

  return (
    <div
      ref={resultRef}
      className="print-section space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 mt-10"
    >
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold text-slate-800">Clinical AI Report</h2>
      </div>

      <div
        className="bg-white border p-6 sm:p-8 rounded-4xl relative overflow-hidden transition-all duration-1000"
        style={{
          borderColor: result.risk_stratification.color,
          boxShadow: `0 20px 50px -10px ${result.risk_stratification.color}30`,
        }}
      >
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: result.risk_stratification.color }}
        />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: result.risk_stratification.color }}
              />
              <Label className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                Risk Stratification
              </Label>
            </div>
            <h3
              className="font-black text-4xl sm:text-5xl tracking-tight"
              style={{ color: result.risk_stratification.color }}
            >
              {result.risk_stratification.category}
            </h3>
          </div>

          <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-right min-w-[140px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
              Estimated ΔMMSE
            </span>
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
            <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              Review Cycle:
            </span>
            {result.risk_stratification.monitoring}
          </div>
          <div
            className="flex items-center gap-2 text-xs font-mono font-bold bg-white px-4 py-2 rounded-xl border border-slate-200"
            style={{ color: result.risk_stratification.color }}
          >
            <span className="text-slate-400 uppercase text-[10px] tracking-wider font-sans">
              Model Confidence (MAE):
            </span>
            {result.model_info?.loocv_mae || "1.38"}
          </div>
        </div>
      </div>

      {result?.gene_contributions && (
        <div className="bg-white border border-[#EAE5D9] shadow-sm p-6 sm:p-8 rounded-4xl">
          <div className="flex justify-between items-center mb-8">
            <Label className="block text-xs font-bold tracking-widest uppercase text-slate-500">
              Explainable AI (SHAP Contributions)
            </Label>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.gene_contributions}
                layout="vertical"
                margin={{ left: -20, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="symbol"
                  type="category"
                  stroke="#94A3B8"
                  fontSize={12}
                  fontFamily="monospace"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#1E293B",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="contribution" radius={[0, 8, 8, 0]} barSize={24}>
                  {result.gene_contributions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.contribution < 0 ? "#EF4444" : "#10B981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-50">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Drives Decline (Harmful)
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Protects Cognition (Protective)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}