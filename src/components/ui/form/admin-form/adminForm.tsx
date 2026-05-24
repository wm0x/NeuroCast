"use client";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiUsers,
  FiActivity,
  FiServer,
  FiPlus,
  FiMoreVertical,
  FiTrendingUp,
  FiShield,
  FiClock,
  FiLoader,
} from "react-icons/fi";
import { FaPeopleGroup, FaUserDoctor } from "react-icons/fa6";
import IntroDisclosureDemo from "./MangeDoctor";
import { MdOutlineLogout } from "react-icons/md";

interface AdminFormProps {
  onLogout: () => void;
}

export interface DashboardData {
  stats: {
    totalPredictions: number;
    activePatients: number;
    apiUptime: string;
    securityStatus: string;
  };
  trafficData: { name: string; visits: number; api_calls: number }[];
  riskData: { name: string; value: number; color: string }[];
  recentPatients: {
    id: string;
    name: string;
    age: number;
    mmse: number;
    risk: string;
    date: string;
  }[];
  doctorsList: {
    id: string;
    name: string;
    spec: string;
    status: string;
    patients: number;
  }[];
}

export default function AdminForm({ onLogout }: AdminFormProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#FDFBF7] rounded-4xl">
        <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">
          Loading Command Center...
        </h2>
        <p className="text-sm text-slate-500">
          Syncing with NeuroCast Database
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#FDFBF7] rounded-4xl">
        <div className="text-red-500 font-bold text-xl mb-2">
          Connection Error
        </div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-slate-800 font-sans p-4 sm:p-8 rounded-4xl overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <MdAdminPanelSettings className="text-blue-600 w-8 h-8" />
            NeuroCast Command Center
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            System overview, AI API usage, and clinical staff management.
          </p>
        </div>

        <div className="flex items-center">
          <IntroDisclosureDemo />

          <button
            onClick={onLogout}
            title="Logout"
            className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-all border border-red-100 hover:border-red-200 shadow-sm active:scale-95"
          >
            <MdOutlineLogout className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Predictions"
          value={data.stats.totalPredictions.toLocaleString()}
          trend="+14.2%"
          icon={<FiActivity />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Active Patients"
          value={data.stats.activePatients.toLocaleString()}
          trend="+5.1%"
          icon={<FiUsers />}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          title="API Uptime"
          value={data.stats.apiUptime}
          trend="Vercel Edge"
          icon={<FiServer />}
          color="text-violet-600"
          bg="bg-violet-50"
        />
        <StatCard
          title="Security Status"
          value={data.stats.securityStatus}
          trend="HIPAA Compliant"
          icon={<FiShield />}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col text-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Platform Traffic & API Calls
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Last 7 days (Vercel Analytics Simulation)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div> Web
                Visits
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> AI
                Inferences
              </span>
            </div>
          </div>

          <div className="flex-1 w-full h-[250px] min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.trafficData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E293B" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1E293B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                />
                <CartesianGrid
                  vertical={false}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#1E293B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
                <Area
                  type="monotone"
                  dataKey="api_calls"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorApi)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Risk Stratification Donut Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col items-center text-xs">
          <div className="w-full flex justify-between items-center mb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Risk Stratification
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Global Patient Cohort
              </p>
            </div>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#1E293B" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">
                {data.riskData
                  .reduce((acc, curr) => acc + curr.value, 0)
                  .toLocaleString()}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Patients
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            {data.riskData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs font-bold text-slate-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* 3. Recent Patient Scans Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Recent AI Stratifications
            </h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-bold">Patient ID & Name</th>
                  <th className="pb-3 font-bold">Baseline MMSE</th>
                  <th className="pb-3 font-bold">AI Risk Prediction</th>
                  <th className="pb-3 font-bold text-right">Last Scan</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {data.recentPatients.map((patient, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {patient.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            {patient.id} • {patient.age}y
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-mono text-slate-600">
                      {patient.mmse} / 30
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          patient.risk === "High Risk" ||
                          patient.risk === "Critical"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : patient.risk === "Moderate"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {patient.risk}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-slate-500 font-medium flex justify-end items-center gap-1.5">
                      <FiClock className="w-3 h-3" /> {patient.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Clinical Staff</h2>
            <div className="text-slate-400 text-xl "> </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center">
            {data.doctorsList.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                    {doc.name.split(" ")[1]?.[0] || doc.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{doc.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {doc.spec}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Sub-components
// ==========================================

function StatCard({
  title,
  value,
  trend,
  icon,
  color,
  bg,
}: {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <FiTrendingUp /> {trend}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tight text-slate-800">
          {value}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
          {title}
        </p>
      </div>
    </div>
  );
}

function MdAdminPanelSettings(props: any) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M17 11c.34 0 .67.04 1 .09V6.27L10.5 3 3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82.55-.13 1.08-.32 1.6-.55-.69-.98-1.1-2.17-1.1-3.45 0-3.31 2.69-6 6-6z"></path>
      <path d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12-1.12-.51-1.12-1.12.51-1.12 1.12-1.12zm0 4.87c-1.25 0-2.33-.57-2.95-1.44.02-.99 1.97-1.49 2.95-1.49s2.93.5 2.95 1.49c-.62.87-1.7 1.44-2.95 1.44z"></path>
    </svg>
  );
}
