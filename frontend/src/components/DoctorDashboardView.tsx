"use client";

import React from "react";
import { Activity, Plus, FileText, Database, CheckCircle2, AlertTriangle, ArrowRight, Stethoscope, Sparkles } from "lucide-react";

interface DoctorDashboardViewProps {
  user?: { name: string; role: string; email: string } | null;
  onNewConsultation: () => void;
  onSelectConsultation: (id: string) => void;
  onPresetSelect: (presetId: string) => void;
}

export default function DoctorDashboardView({
  user,
  onNewConsultation,
  onSelectConsultation,
  onPresetSelect,
}: DoctorDashboardViewProps) {
  const recentConsultations = [
    {
      id: "P1023",
      patientCode: "Patient #P1023",
      age: 45,
      sex: "Male",
      category: "Respiratory",
      symptoms: "Fever 38.9°C, Productive Cough, Dyspnea",
      status: "Completed",
      statusColor: "glow-pill-emerald",
      date: "Today, 09:42 AM",
    },
    {
      id: "P1024",
      patientCode: "Patient #P1024",
      age: 52,
      sex: "Female",
      category: "Diabetes",
      symptoms: "Hyperglycemia (345 mg/dL), Kussmaul Breathing",
      status: "Completed",
      statusColor: "glow-pill-emerald",
      date: "Today, 09:15 AM",
    },
    {
      id: "P1025",
      patientCode: "Patient #P1025",
      age: 61,
      sex: "Male",
      category: "Chest Pain",
      symptoms: "Substernal Chest Pressure, BP 185/115 mmHg",
      status: "Review Required",
      statusColor: "bg-amber-500/10 light-theme:bg-amber-100 text-amber-300 light-theme:text-amber-900 border border-amber-500/35 light-theme:border-amber-300 shadow-sm",
      date: "Today, 08:30 AM",
    },
    {
      id: "P1026",
      patientCode: "Patient #P1026",
      age: 38,
      sex: "Female",
      category: "Infectious Disease",
      symptoms: "Acute Gastroenteritis, Moderate Dehydration",
      status: "Completed",
      statusColor: "glow-pill-emerald",
      date: "Yesterday, 04:50 PM",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Notice */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-md shadow-emerald-400" />
            <h2 className="text-2xl font-black text-slate-100 light-theme:text-slate-900 tracking-tight">Clinical Decision Support Hub</h2>
          </div>
          <p className="text-xs text-slate-300 light-theme:text-slate-600 font-medium">
            Welcome back, <span className="text-gradient-emerald-cyan font-bold">{user?.name || "Physician"}</span>. System active with 20+ clinical guidelines & 5 autonomous agents.
          </p>
        </div>

        <button
          onClick={onNewConsultation}
          className="w-full md:w-auto bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-xs uppercase tracking-wider">+ NEW CLINICAL CONSULTATION</span>
        </button>
      </div>

      {/* Main Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/90 light-theme:bg-white border border-emerald-500/30 light-theme:border-slate-300 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 light-theme:bg-emerald-50 border border-emerald-500/30 light-theme:border-emerald-200 flex items-center justify-center text-emerald-400 light-theme:text-emerald-700 shadow-md">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 light-theme:text-slate-600 uppercase tracking-wider">Today&apos;s Consultations</p>
            <h3 className="text-3xl font-black text-slate-100 light-theme:text-slate-900 mt-0.5">24</h3>
            <p className="text-[11px] text-emerald-400 light-theme:text-emerald-700 font-bold mt-1">↑ 12% from average</p>
          </div>
        </div>

        <div className="bg-slate-900/90 light-theme:bg-white border border-cyan-500/30 light-theme:border-slate-300 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 light-theme:bg-cyan-50 border border-cyan-500/30 light-theme:border-cyan-200 flex items-center justify-center text-cyan-400 light-theme:text-cyan-700 shadow-md">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 light-theme:text-slate-600 uppercase tracking-wider">Reports Generated</p>
            <h3 className="text-3xl font-black text-slate-100 light-theme:text-slate-900 mt-0.5">21</h3>
            <p className="text-[11px] text-cyan-400 light-theme:text-cyan-700 font-bold mt-1">100% Agent Audited</p>
          </div>
        </div>

        <div className="bg-slate-900/90 light-theme:bg-white border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 light-theme:bg-teal-50 border border-teal-500/30 light-theme:border-teal-200 flex items-center justify-center text-teal-400 light-theme:text-teal-700 shadow-md">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 light-theme:text-slate-600 uppercase tracking-wider">Evidence Retrieved</p>
            <h3 className="text-3xl font-black text-slate-100 light-theme:text-slate-900 mt-0.5">137</h3>
            <p className="text-[11px] text-teal-400 light-theme:text-teal-700 font-bold mt-1">PubMed & WHO Matched</p>
          </div>
        </div>
      </div>

      {/* Preset Demo Clinical Cases Row */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold text-slate-300 light-theme:text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 light-theme:text-emerald-600" />
          Quick 1-Click Clinical Case Selectors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onPresetSelect("pneumonia")}
            className="p-4 rounded-2xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-emerald-500/50 light-theme:hover:border-emerald-500 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-emerald-400 light-theme:text-emerald-800 uppercase tracking-wider glow-pill-emerald px-2 py-0.5 rounded-full">Pulmonology</span>
              <span className="text-xs text-slate-500 light-theme:text-slate-600 group-hover:text-emerald-400 light-theme:group-hover:text-emerald-700 transition font-semibold">Run Demo →</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-emerald-300 light-theme:group-hover:text-emerald-700">Acute Pneumonia & Dyspnea</h4>
            <p className="text-xs text-slate-400 light-theme:text-slate-600 mt-1 font-medium">45M presenting with fever 38.9°C, productive cough, SpO2 91%.</p>
          </button>

          <button
            onClick={() => onPresetSelect("dka")}
            className="p-4 rounded-2xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-cyan-500/50 light-theme:hover:border-cyan-500 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-cyan-400 light-theme:text-cyan-800 uppercase tracking-wider glow-pill-cyan px-2 py-0.5 rounded-full">Endocrinology</span>
              <span className="text-xs text-slate-500 light-theme:text-slate-600 group-hover:text-cyan-400 light-theme:group-hover:text-cyan-700 transition font-semibold">Run Demo →</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-cyan-300 light-theme:group-hover:text-cyan-700">Diabetic Ketoacidosis (DKA)</h4>
            <p className="text-xs text-slate-400 light-theme:text-slate-600 mt-1 font-medium">52F with blood glucose 345 mg/dL, urine ketones ++, lethargy.</p>
          </button>

          <button
            onClick={() => onPresetSelect("chest_pain")}
            className="p-4 rounded-2xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-teal-500/50 light-theme:hover:border-teal-500 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-teal-400 light-theme:text-teal-800 uppercase tracking-wider bg-teal-500/10 light-theme:bg-teal-100 text-teal-300 light-theme:text-teal-900 border border-teal-500/30 light-theme:border-teal-300 px-2 py-0.5 rounded-full">Cardiology</span>
              <span className="text-xs text-slate-500 light-theme:text-slate-600 group-hover:text-teal-400 light-theme:group-hover:text-teal-700 transition font-semibold">Run Demo →</span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-teal-300 light-theme:group-hover:text-teal-700">Hypertensive Crisis</h4>
            <p className="text-xs text-slate-400 light-theme:text-slate-600 mt-1 font-medium">61M with substernal pressure, BP 185/115 mmHg, diaphoresis.</p>
          </button>
        </div>
      </div>

      {/* Recent Consultations Table */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-100 light-theme:text-slate-900">Recent Patient Consultations</h3>
          <span className="text-xs text-slate-400 light-theme:text-slate-600 font-medium">Showing 4 of 24 total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 light-theme:border-slate-200 text-[11px] font-bold text-slate-400 light-theme:text-slate-600 uppercase tracking-wider">
                <th className="pb-3 px-4">Patient Code</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Symptoms Presentation</th>
                <th className="pb-3 px-4">Validation Status</th>
                <th className="pb-3 px-4">Date & Time</th>
                <th className="pb-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 light-theme:divide-slate-200">
              {recentConsultations.map((c) => (
                <tr key={c.id} className="hover:bg-slate-950/40 light-theme:hover:bg-slate-50 transition">
                  <td className="py-4 px-4 font-bold text-slate-200 light-theme:text-slate-900">{c.patientCode}</td>
                  <td className="py-4 px-4 text-emerald-400 light-theme:text-emerald-700 font-bold">{c.category}</td>
                  <td className="py-4 px-4 text-slate-300 light-theme:text-slate-700 max-w-xs truncate font-medium">{c.symptoms}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${c.statusColor}`}>
                      {c.status === "Completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-400 light-theme:text-slate-600 font-medium">{c.date}</td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onSelectConsultation(c.id)}
                      className="text-xs font-bold text-emerald-400 light-theme:text-emerald-700 hover:underline flex items-center justify-end gap-1 ml-auto transition"
                    >
                      View Report
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
