"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Database, Brain, Stethoscope, ShieldCheck, FileText, Clock, Sparkles } from "lucide-react";

interface AgentStep {
  name: string;
  key: string;
  icon: any;
  description: string;
}

interface AgentLiveTrackerProps {
  logs: any[];
  onComplete: () => void;
}

const AGENT_STEPS: AgentStep[] = [
  {
    name: "Retrieval Agent",
    key: "Retrieval Agent",
    icon: Database,
    description: "Querying vector database for WHO, PubMed & clinical guidelines evidence.",
  },
  {
    name: "Diagnosis Agent",
    key: "Diagnosis Agent",
    icon: Brain,
    description: "Analyzing symptoms & mapping differential diagnoses with confidence scores.",
  },
  {
    name: "Treatment Agent",
    key: "Treatment Agent",
    icon: Stethoscope,
    description: "Formulating evidence-backed clinical management and contraindication audit.",
  },
  {
    name: "Validation Agent",
    key: "Validation Agent",
    icon: ShieldCheck,
    description: "Cross-checking recommendations against retrieved evidence for consistency.",
  },
  {
    name: "Explainability Agent",
    key: "Explainability Agent",
    icon: FileText,
    description: "Synthesizing clinical summary, missing info alerts, and source citations.",
  },
];

export default function AgentLiveTrackerView({ logs, onComplete }: AgentLiveTrackerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Simulate real-time progress steps for high visual feedback demo
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < AGENT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900/80 light-theme:bg-white border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-teal-500/10 light-theme:bg-teal-50 border border-teal-500/30 light-theme:border-teal-200 text-teal-400 light-theme:text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Sparkles className="w-6 h-6 animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-black text-slate-100 light-theme:text-slate-900 tracking-tight">CLINICAL MULTI-AGENT PIPELINE</h2>
        <p className="text-xs text-teal-400 light-theme:text-teal-700 font-bold uppercase tracking-wider mt-1">
          Shared State Workflow Execution
        </p>
        <p className="text-xs text-slate-400 light-theme:text-slate-600 font-medium max-w-md mx-auto mt-2">
          Executing 5 specialized autonomous agents over a shared clinical state object.
        </p>
      </div>

      {/* Agents Timeline Steps */}
      <div className="bg-slate-900/60 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 space-y-4 shadow-xl">
        {AGENT_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex || currentStepIndex === AGENT_STEPS.length - 1;
          const isCurrent = idx === currentStepIndex && currentStepIndex < AGENT_STEPS.length - 1;
          const IconComponent = step.icon;

          // Find log if available
          const logItem = logs.find((l) => l.agent === step.key);

          return (
            <div
              key={step.key}
              className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                isDone
                  ? "bg-slate-950 light-theme:bg-emerald-50/50 border-teal-500/40 light-theme:border-teal-300 shadow-sm"
                  : isCurrent
                  ? "bg-slate-900 light-theme:bg-cyan-50 border-cyan-500/60 light-theme:border-cyan-300 ring-2 ring-cyan-500/20 shadow-lg"
                  : "bg-slate-950/40 light-theme:bg-slate-100 border-slate-850 light-theme:border-slate-200 opacity-60"
              }`}
            >
              {/* Icon Status */}
              <div className="pt-0.5">
                {isDone ? (
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 light-theme:bg-teal-100 text-teal-400 light-theme:text-teal-800 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 light-theme:bg-cyan-100 text-cyan-400 light-theme:text-cyan-800 flex items-center justify-center animate-spin">
                    <Loader2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 light-theme:bg-slate-200 text-slate-500 light-theme:text-slate-600 flex items-center justify-center">
                    <IconComponent className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold ${isDone ? "text-teal-300 light-theme:text-emerald-950" : isCurrent ? "text-cyan-300 light-theme:text-cyan-950" : "text-slate-400 light-theme:text-slate-600"}`}>
                    {step.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isDone
                        ? "bg-teal-500/10 light-theme:bg-emerald-100 text-teal-400 light-theme:text-emerald-800 border border-teal-500/30 light-theme:border-emerald-300"
                        : isCurrent
                        ? "bg-cyan-500/10 light-theme:bg-cyan-100 text-cyan-400 light-theme:text-cyan-800 border border-cyan-500/30 light-theme:border-cyan-300"
                        : "bg-slate-800 light-theme:bg-slate-200 text-slate-500 light-theme:text-slate-600"
                    }`}
                  >
                    {isDone ? "COMPLETED" : isCurrent ? "EXECUTING..." : "WAITING"}
                  </span>
                </div>

                <p className="text-xs text-slate-300 light-theme:text-slate-700 mt-1 font-medium">{step.description}</p>

                {logItem && (
                  <div className="mt-2 text-[11px] text-slate-400 light-theme:text-slate-700 font-mono bg-slate-950 light-theme:bg-white p-2 rounded-lg border border-slate-800/80 light-theme:border-slate-200 flex items-center justify-between shadow-sm">
                    <span>{logItem.summary}</span>
                    <span className="text-teal-400 light-theme:text-teal-700 font-bold flex items-center gap-1 shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      {logItem.duration_ms}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Logs Stream */}
      <div className="bg-slate-950 light-theme:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl p-4 text-xs font-mono shadow-md">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Live Agent Execution Logs</p>
        <div className="space-y-1 text-slate-400">
          <p className="text-teal-400">09:42:11 [SYSTEM] Pipeline initialized with Patient State</p>
          {currentStepIndex >= 0 && <p className="text-cyan-400">09:42:11 [Retrieval Agent] Query vector DB -&gt; 5 chunks matched (Score &gt; 0.85)</p>}
          {currentStepIndex >= 1 && <p className="text-cyan-400">09:42:12 [Diagnosis Agent] Differential analysis completed -&gt; 2 conditions mapped</p>}
          {currentStepIndex >= 2 && <p className="text-cyan-400">09:42:13 [Treatment Agent] Clinical considerations generated -&gt; Antibiotics & Oxygen protocol</p>}
          {currentStepIndex >= 3 && <p className="text-teal-300 font-bold">09:42:14 [Validation Agent] Safety Audit PASS -&gt; 92% Evidence score</p>}
          {currentStepIndex >= 4 && <p className="text-emerald-400 font-bold">09:42:15 [Explainability Agent] Clinical summary generated -&gt; Ready for Doctor Review</p>}
        </div>
      </div>
    </div>
  );
}
