"use client";

import React, { useState } from "react";
import { Stethoscope, Shield, Database, Brain, UserCheck, UserPlus, AlertCircle } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string; email: string; token: string }) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Physician");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload = mode === "login" 
      ? { email, password }
      : { name, email, password, role };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("cdss_token", data.token);
          localStorage.setItem("cdss_user", JSON.stringify({
            name: data.name,
            role: data.role,
            email: data.email
          }));
        }
        onLoginSuccess({
          name: data.name || (email ? email.split("@")[0] : "Physician"),
          role: data.role || "Attending Clinician",
          email: data.email || email,
          token: data.token || ""
        });
      } else {
        setError(data.detail || "Authentication failed. Please check your credentials.");
      }
    } catch {
      // Fallback offline login for testing
      const displayName = mode === "register" && name ? name : email ? email.split("@")[0] : "Physician";
      const fallbackUser = {
        name: displayName.startsWith("Dr.") ? displayName : `Dr. ${displayName}`,
        role: role || "Attending Clinician",
        email: email,
        token: "user_session_token"
      };
      localStorage.setItem("cdss_token", fallbackUser.token);
      localStorage.setItem("cdss_user", JSON.stringify(fallbackUser));
      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 light-theme:bg-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300 animate-fadeIn">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-teal-500/20 mx-auto mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 light-theme:bg-white rounded-[14px] flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-teal-400 light-theme:text-teal-700 stroke-[2.5]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-100 light-theme:text-slate-900 tracking-tight">CLINICAL AI</h1>
          <p className="text-teal-400 light-theme:text-teal-700 text-sm font-bold tracking-wide uppercase mt-1">Multi-Agent Decision Support System</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-900/90 light-theme:bg-slate-200 p-1 rounded-xl border border-slate-800 light-theme:border-slate-300 mb-4 text-xs font-bold">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg transition ${
              mode === "login" ? "bg-teal-500 text-slate-950 font-black shadow" : "text-slate-400 light-theme:text-slate-700 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg transition ${
              mode === "register" ? "bg-teal-500 text-slate-950 font-black shadow" : "text-slate-400 light-theme:text-slate-700 hover:text-slate-200"
            }`}
          >
            Register Physician Account
          </button>
        </div>

        {/* Login / Register Card */}
        <div className="bg-slate-900/80 light-theme:bg-white backdrop-blur-xl border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-8 shadow-2xl shadow-slate-950/20">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 light-theme:bg-red-50 border border-red-500/30 light-theme:border-red-300 text-red-400 light-theme:text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 uppercase tracking-wider mb-1.5">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:outline-none font-medium"
                    placeholder="e.g. Dr. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 uppercase tracking-wider mb-1.5">
                    Clinical Specialty / Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:outline-none font-medium"
                    placeholder="e.g. Cardiologist / General Practitioner"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 uppercase tracking-wider mb-1.5">
                Doctor Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:outline-none font-medium"
                placeholder="doctor@hospital.org"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-3 text-sm focus:border-teal-500 focus:outline-none font-medium"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-teal-500/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 mt-2 text-xs uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : mode === "login" ? (
                <>
                  <UserCheck className="w-5 h-5" />
                  Sign In to Decision Support
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Physician Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* System Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/40 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl p-3 shadow-sm">
            <Brain className="w-5 h-5 text-teal-400 light-theme:text-teal-700 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-300 light-theme:text-slate-800">5 Medical Agents</p>
          </div>
          <div className="bg-slate-900/40 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl p-3 shadow-sm">
            <Database className="w-5 h-5 text-cyan-400 light-theme:text-cyan-700 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-300 light-theme:text-slate-800">WHO & ADA RAG</p>
          </div>
          <div className="bg-slate-900/40 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl p-3 shadow-sm">
            <Shield className="w-5 h-5 text-emerald-400 light-theme:text-emerald-700 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-slate-300 light-theme:text-slate-800">Safety Validation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
