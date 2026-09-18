"use client";

import React from "react";
import { Activity, Stethoscope, BookOpen, BarChart3, LogOut, Sun, Moon } from "lucide-react";

interface HeaderProps {
  user: { name: string; role: string; email: string } | null;
  currentTab: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Header({
  user,
  currentTab,
  theme,
  onToggleTheme,
  onSelectTab,
  onLogout,
}: HeaderProps) {
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 light-theme:bg-white/90 backdrop-blur-xl border-b border-slate-800 light-theme:border-slate-200 px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onSelectTab("dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 light-theme:bg-white rounded-[10px] flex items-center justify-center text-emerald-500 font-black">
              <Stethoscope className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-slate-100 light-theme:text-slate-900 tracking-tight">CLINICAL<span className="text-gradient-emerald-cyan">.AI</span></span>
              <span className="glow-pill-emerald text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                5-AGENT RAG CDSS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 light-theme:text-slate-500 font-medium">Rural Healthcare Decision Support System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 light-theme:bg-slate-100 p-1.5 rounded-2xl border border-slate-800 light-theme:border-slate-200">
          <button
            onClick={() => onSelectTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === "dashboard"
                ? "bg-emerald-500/20 light-theme:bg-emerald-50 text-emerald-400 light-theme:text-emerald-700 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 light-theme:text-slate-600 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            Dashboard
          </button>

          <button
            onClick={() => onSelectTab("new_consultation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === "new_consultation"
                ? "bg-emerald-500/20 light-theme:bg-emerald-50 text-emerald-400 light-theme:text-emerald-700 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 light-theme:text-slate-600 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-cyan-500" />
            New Consultation
          </button>

          <button
            onClick={() => onSelectTab("knowledge")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === "knowledge"
                ? "bg-emerald-500/20 light-theme:bg-emerald-50 text-emerald-400 light-theme:text-emerald-700 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 light-theme:text-slate-600 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-500" />
            Knowledge Base
          </button>

          <button
            onClick={() => onSelectTab("evaluation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === "evaluation"
                ? "bg-emerald-500/20 light-theme:bg-emerald-50 text-emerald-400 light-theme:text-emerald-700 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 light-theme:text-slate-600 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            Evaluation Metrics
          </button>
        </div>

        {/* Theme Toggle & Doctor Avatar Card */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 light-theme:bg-slate-100 text-slate-300 light-theme:text-slate-700 border border-slate-700 light-theme:border-slate-300 hover:border-emerald-500 transition text-xs font-bold"
            title="Toggle Light / Dark Mode"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Dark</span>
              </>
            )}
          </button>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900">{user.name}</p>
            <p className="text-[10px] text-emerald-500 font-semibold">{user.role}</p>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl bg-slate-800 light-theme:bg-slate-100 border border-slate-700 light-theme:border-slate-300 text-slate-400 hover:text-rose-500 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
