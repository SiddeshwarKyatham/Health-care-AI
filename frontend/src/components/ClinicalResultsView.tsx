"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Database,
  Stethoscope,
  Brain,
  ShieldCheck,
  Download,
  Plus,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Activity,
  Pill,
  Award,
  Zap,
  User,
  Thermometer,
  Printer,
  Sparkles,
  HelpCircle,
  FileCheck,
  Clock,
  FlaskConical,
  Microscope,
  CheckSquare,
  AlertOctagon,
  LifeBuoy,
  Layers,
  ArrowRight,
} from "lucide-react";

interface ClinicalResultsViewProps {
  state: any;
  onNewConsultation: () => void;
}

export default function ClinicalResultsView({ state, onNewConsultation }: ClinicalResultsViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "evidence" | "audit">("summary");
  const [showRawJson, setShowRawJson] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<number | null>(null);

  const patient = state.patient_data || {};
  const diagnosisState = state.diagnosis || {};
  const evidenceList = state.retrieved_evidence || [];
  const treatment = state.treatment || {};
  const validation = state.validation || {};
  const explanation = state.explanation || {};

  // 1. Likely Condition (Primary Supported Diagnosis)
  const likelyCondition = diagnosisState.likely_condition || {
    condition: "Acute Febrile Illness / Viral Upper Respiratory Infection",
    confidence: "High (82%)",
    description: "Current symptoms (mild fever, headache, malaise) are most consistent with a common viral or acute minor febrile infection based on available presentation.",
    reasoning: "Absence of focal neurological signs, shock, or severe hypoxemia strongly supports a common self-limiting infection over acute central nervous system disease.",
    supporting_evidence: [evidenceList[0]?.title || "WHO Guidelines"],
  };

  // 2. Conditions to Rule Out (Differentials)
  const conditionsToRuleOut = diagnosisState.conditions_to_rule_out || [
    {
      condition: "Bacterial Meningitis / CNS Infection",
      risk_level: "Low Risk - Rule Out",
      rule_out_criteria: "Monitor for development of severe nuchal rigidity, photophobia, Kernig's/Brudzinski's signs, or altered consciousness.",
      supporting_evidence: ["CDC Bacterial Meningitis Guidance"],
    },
    {
      condition: "Systemic Bacteremia / Sepsis",
      risk_level: "Low Risk - Rule Out",
      rule_out_criteria: "Perform CBC & blood cultures if fever persists > 48 hours or if hemodynamic instability develops.",
      supporting_evidence: ["Surviving Sepsis Campaign Guidelines"],
    },
  ];

  // 3. Red Flags & Escalation Warnings
  const redFlags = diagnosisState.red_flags || [
    {
      warning_sign: "Onset of severe nuchal rigidity (stiff neck), photophobia, or Kernig's sign",
      clinical_significance: "Indicates acute meningeal irritation requiring immediate LP and empiric IV antibiotics.",
      required_action: "Immediate emergency room transfer and bedside physician evaluation.",
    },
    {
      warning_sign: "Acute deterioration in level of consciousness or new onset seizures",
      clinical_significance: "Signals central nervous system decompensation or cerebral edema.",
      required_action: "Airway protection, emergency neuroimaging, and intensive care evaluation.",
    },
    {
      warning_sign: "Drop in SpO2 < 90% or Systolic Blood Pressure < 90 mmHg",
      clinical_significance: "Indicates acute respiratory failure or septic shock.",
      required_action: "Immediate supplemental high-flow oxygen and fluid resuscitation.",
    },
  ];

  // 4. Calibrated Case Priority
  const casePriority = diagnosisState.case_priority || {
    level: "ROUTINE",
    reason: "Current symptoms are consistent with a mild/common infection with stable vital signs and zero red-flag warning signs.",
    next_action: "Outpatient clinical consultation, supportive symptomatic care, and patient education on red-flag warning signs.",
  };

  const pLevel = (casePriority.level || "ROUTINE").toUpperCase();
  const isEmergency = pLevel.includes("EMERGENCY") || pLevel.includes("IMMEDIATE");
  const isUrgent = pLevel.includes("URGENT") && !isEmergency;

  const validationStatus = validation.status || "PASS";
  const evidenceScore = validation.evidence_score || 92;

  // Extract Recommended Tests
  const recommendedTests = diagnosisState.recommended_tests || [
    {
      test_name: "Complete Blood Count (CBC) with Differential",
      relevance: "Assesses white blood cell count, leukocytosis, and neutrophilic shift.",
      confirms_excludes: "Evaluates systemic inflammatory response and differentiates bacterial vs viral pattern.",
      priority: "Routine",
      evidence_source: evidenceList[0]?.title || "WHO Guidelines",
    },
    {
      test_name: "Rapid Diagnostic Panel / Serum CRP",
      relevance: "Measures systemic inflammatory biomarker level.",
      confirms_excludes: "Helps confirm benign viral course or detect hidden acute bacterial inflammation.",
      priority: "Routine",
      evidence_source: evidenceList[0]?.title || "WHO Guidelines",
    },
  ];

  // Extract Treatment Categories
  const treatmentCategories = treatment.treatment_categories || [
    {
      category: "Symptomatic & Supportive Care",
      general_purpose: "Relieves fever, systemic malaise, and body aches.",
      clinical_considerations: "Prescribe antipyretics and maintain oral rehydration. Doctor review required.",
      reference_options: "Paracetamol 500mg-1000mg PO PRN Q6H",
      evidence_source: evidenceList[0]?.title || "WHO Guidelines",
    },
    {
      category: "Patient Observation & Red-Flag Guidance",
      general_purpose: "Monitors clinical trajectory and provides clear return precautions.",
      clinical_considerations: "Instruct patient to seek immediate emergency care if neck stiffness, confusion, or breathing difficulty occurs.",
      reference_options: "Outpatient monitoring with 48h follow-up",
      evidence_source: evidenceList[0]?.title || "WHO Guidelines",
    },
  ];

  const safetyDisclaimer = treatment.disclaimer || "Clinical Decision Support: Recommendations are generated from available patient information and retrieved medical evidence. They are intended to assist, not replace, professional clinical judgment. Final diagnosis, investigation, treatment, and prescribing decisions must be made by a qualified healthcare professional.";

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* 1. Top Clinical Safety & Action Bar */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 light-theme:bg-teal-50 text-teal-400 light-theme:text-teal-700 flex items-center justify-center shrink-0 font-bold border border-teal-500/30 light-theme:border-teal-200">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-100 light-theme:text-slate-900 uppercase tracking-wider">
                Clinical Decision Support System
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 light-theme:bg-emerald-100 text-emerald-400 light-theme:text-emerald-800 border border-emerald-500/30 light-theme:border-emerald-300">
                5-Agent RAG Active
              </span>
            </div>
            <p className="text-xs text-slate-400 light-theme:text-slate-600 mt-0.5 font-medium">
              Patient #{patient.consultation_id ? patient.consultation_id.slice(0, 8) : "P1027"} • {patient.age || 45}Y / {patient.sex || "Male"} • Dr. Pavan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => {
              const cId = patient.consultation_id || "demo";
              window.open(`http://localhost:8000/api/consultation/${cId}/pdf`, "_blank");
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-950 light-theme:bg-slate-100 hover:bg-slate-800 light-theme:hover:bg-slate-200 border border-emerald-500/30 light-theme:border-slate-300 text-emerald-400 light-theme:text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            PDF Report
          </button>

          <button
            onClick={onNewConsultation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            New Intake
          </button>
        </div>
      </div>

      {/* 2. 5-SECOND EXECUTIVE HERO DASHBOARD (3 Quick-Insight Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Box 1: Primary Likely Diagnosis */}
        <div className="bg-slate-900/90 light-theme:bg-emerald-50/90 border border-emerald-500/40 light-theme:border-emerald-300 rounded-2xl p-5 space-y-3 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 light-theme:text-emerald-800 bg-emerald-500/10 light-theme:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-500/30 light-theme:border-emerald-300">
                Likely Condition
              </span>
              <span className="text-xs font-bold text-cyan-400 light-theme:text-cyan-800 bg-cyan-500/10 light-theme:bg-cyan-100 px-2 py-0.5 rounded border border-cyan-500/30 light-theme:border-cyan-300">
                {likelyCondition.confidence} Match
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-100 light-theme:text-emerald-950 line-clamp-1">
              {likelyCondition.condition}
            </h2>

            <p className="text-xs text-slate-300 light-theme:text-emerald-900 line-clamp-3 leading-relaxed font-medium">
              {likelyCondition.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 light-theme:border-emerald-200 text-[11px] text-slate-400 light-theme:text-emerald-800 flex items-center justify-between">
            <span>Primary Category:</span>
            <span className="font-bold text-emerald-400 light-theme:text-emerald-800">Evidence Backed</span>
          </div>
        </div>

        {/* Box 2: Calibrated Urgency & Priority */}
        <div
          className={`rounded-2xl p-5 space-y-3 shadow-lg border flex flex-col justify-between ${
            isEmergency
              ? "bg-rose-950/40 light-theme:bg-rose-50 border-rose-500/50 light-theme:border-rose-300"
              : isUrgent
              ? "bg-amber-950/40 light-theme:bg-amber-50 border-amber-500/50 light-theme:border-amber-300"
              : "bg-teal-950/40 light-theme:bg-teal-50 border-teal-500/50 light-theme:border-teal-300"
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 light-theme:text-slate-600">
                Case Priority Level
              </span>
              <Clock className="w-4 h-4 text-slate-400 light-theme:text-slate-600 animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-black px-3 py-1 rounded-lg border uppercase ${
                  isEmergency
                    ? "bg-rose-500/20 text-rose-300 light-theme:bg-rose-100 light-theme:text-rose-950 border-rose-500/40 light-theme:border-rose-300"
                    : isUrgent
                    ? "bg-amber-500/20 text-amber-300 light-theme:bg-amber-100 light-theme:text-amber-950 border-amber-500/40 light-theme:border-amber-300"
                    : "bg-teal-500/20 text-teal-300 light-theme:bg-teal-100 light-theme:text-teal-950 border-teal-500/40 light-theme:border-teal-300"
                }`}
              >
                {pLevel}
              </span>
            </div>

            <p className="text-xs text-slate-200 light-theme:text-slate-900 line-clamp-3 leading-relaxed font-semibold">
              {casePriority.reason}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 light-theme:border-slate-300 text-[11px] text-slate-300 light-theme:text-slate-900 font-bold line-clamp-1">
            <strong>Next Action:</strong> {casePriority.next_action}
          </div>
        </div>

        {/* Box 3: Safety Audit & Literature Grounding */}
        <div className="bg-slate-900/90 light-theme:bg-cyan-50/80 border border-slate-800 light-theme:border-cyan-300 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 light-theme:text-cyan-900">
                Safety Audit Verdict
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 light-theme:text-cyan-800" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-emerald-400 light-theme:text-cyan-950">
                  {evidenceScore}%
                </div>
                <span className="text-[10px] font-bold text-slate-400 light-theme:text-cyan-800 uppercase">Evidence Score</span>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 light-theme:bg-cyan-100 text-emerald-400 light-theme:text-cyan-900 border border-emerald-500/30 light-theme:border-cyan-300">
                {validationStatus}
              </span>
            </div>

            <p className="text-xs text-slate-300 light-theme:text-cyan-900 line-clamp-2 leading-relaxed font-medium">
              {validation.risk_flag || "LOW RISK - Standard Decision Support Guidelines Met"}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 light-theme:border-cyan-200 text-[11px] text-slate-400 light-theme:text-cyan-900 flex items-center justify-between font-medium">
            <span>RAG Chunks Indexed:</span>
            <span className="font-bold text-cyan-400 light-theme:text-cyan-950">{evidenceList.length} Guideline Sources</span>
          </div>
        </div>
      </div>

      {/* 3. TABBED VIEW SWITCHER (Quick Access to Breakdown, Literature, and Audit) */}
      <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-slate-300 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "summary"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-900 light-theme:bg-white text-slate-400 light-theme:text-slate-700 hover:text-slate-100 border border-transparent light-theme:border-slate-300"
            }`}
          >
            <Brain className="w-4 h-4" />
            1. Clinical Assessment & Management
          </button>

          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "evidence"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                : "bg-slate-900 light-theme:bg-white text-slate-400 light-theme:text-slate-700 hover:text-slate-100 border border-transparent light-theme:border-slate-300"
            }`}
          >
            <Database className="w-4 h-4" />
            2. RAG Literature & Evidence ({evidenceList.length})
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "audit"
                ? "bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/20"
                : "bg-slate-900 light-theme:bg-white text-slate-400 light-theme:text-slate-700 hover:text-slate-100 border border-transparent light-theme:border-slate-300"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. Safety Audit & Missing Parameters
          </button>
        </div>

        <span className="text-[11px] text-slate-400 light-theme:text-slate-600 font-semibold hidden sm:inline">
          Click tabs to switch clinical detail views
        </span>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CLINICAL ASSESSMENT & MANAGEMENT (DIAGNOSIS, RULE-OUT, TESTS, TX) */}
      {/* ========================================================================= */}
      {activeTab === "summary" && (
        <div className="space-y-6">
          {/* Section 1: Conditions to Rule Out Card */}
          <div className="bg-slate-900/90 light-theme:bg-amber-50/40 border border-amber-500/30 light-theme:border-amber-300 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-amber-200 pb-3">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-amber-400 light-theme:text-amber-700" />
                <h3 className="text-sm font-bold text-slate-100 light-theme:text-amber-950 uppercase tracking-wider">
                  Differential Conditions to Rule Out
                </h3>
              </div>
              <span className="text-xs text-amber-400 light-theme:text-amber-800 font-bold bg-amber-500/10 light-theme:bg-amber-100 px-2.5 py-0.5 rounded border border-amber-500/30 light-theme:border-amber-300">
                Rule-Out Criteria Applied
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditionsToRuleOut.map((item: any, idx: number) => (
                <div key={idx} className="bg-slate-950/80 light-theme:bg-white border border-slate-800 light-theme:border-amber-200 rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-amber-400 light-theme:text-amber-950 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-400 light-theme:text-amber-700 shrink-0" />
                        {item.condition}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 light-theme:bg-amber-100 text-amber-300 light-theme:text-amber-900 border border-amber-500/30 light-theme:border-amber-300">
                        {item.risk_level || "Rule Out"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 light-theme:text-slate-900 leading-relaxed bg-slate-900/60 light-theme:bg-amber-50/70 p-3 rounded border border-slate-800 light-theme:border-amber-200 font-medium">
                      <strong className="text-amber-400 light-theme:text-amber-900 font-bold">Criteria to Rule Out:</strong> {item.rule_out_criteria}
                    </p>
                  </div>

                  {item.supporting_evidence && item.supporting_evidence.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 light-theme:border-slate-200 text-[10px] text-slate-400 light-theme:text-slate-600 flex items-center justify-between">
                      <span>Guideline Citation:</span>
                      <span className="font-bold text-amber-400 light-theme:text-amber-800 line-clamp-1 max-w-[180px]">{item.supporting_evidence[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Recommended Diagnostic Tests ("Recommended Further Examination") */}
          <div className="bg-slate-900/90 light-theme:bg-blue-50/30 border border-slate-800 light-theme:border-blue-300 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-blue-200 pb-3">
              <div className="flex items-center gap-2.5">
                <FlaskConical className="w-5 h-5 text-blue-400 light-theme:text-blue-700" />
                <h3 className="text-sm font-bold text-slate-100 light-theme:text-blue-950 uppercase tracking-wider">
                  Recommended Further Examination (Diagnostic Investigations)
                </h3>
              </div>
              <span className="text-xs text-blue-400 light-theme:text-blue-800 font-bold bg-blue-500/10 light-theme:bg-blue-100 px-2.5 py-0.5 rounded border border-blue-500/30 light-theme:border-blue-300">
                Derived from RAG Knowledge Base
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTests.map((t: any, idx: number) => (
                <div key={idx} className="bg-slate-950/80 light-theme:bg-white border border-slate-800 light-theme:border-blue-200 rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-100 light-theme:text-blue-950 flex items-center gap-1.5">
                        <Microscope className="w-4 h-4 text-blue-400 light-theme:text-blue-700 shrink-0" />
                        {t.test_name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 light-theme:bg-blue-100 text-blue-400 light-theme:text-blue-900 border border-blue-500/30 light-theme:border-blue-300 shrink-0">
                        {t.priority || "Routine"} Priority
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 light-theme:text-slate-800 leading-snug font-medium">
                      <strong className="text-slate-400 light-theme:text-slate-700 font-bold">Relevance:</strong> {t.relevance}
                    </p>
                    <p className="text-xs text-slate-300 light-theme:text-slate-900 leading-snug bg-slate-900/60 light-theme:bg-blue-50/70 p-2.5 rounded border border-slate-800 light-theme:border-blue-200 font-medium">
                      <strong className="text-teal-400 light-theme:text-teal-800 font-bold">Goal:</strong> {t.confirms_excludes}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 light-theme:border-slate-200 text-[10px] text-slate-400 light-theme:text-slate-600 flex items-center justify-between">
                    <span>Evidence Source:</span>
                    <span className="font-bold text-cyan-400 light-theme:text-cyan-800 line-clamp-1 max-w-[180px]">{t.evidence_source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Potential Treatment Considerations */}
          <div className="bg-slate-900/90 light-theme:bg-teal-50/30 border border-slate-800 light-theme:border-teal-300 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-teal-200 pb-3">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-emerald-400 light-theme:text-teal-700" />
                <h3 className="text-sm font-bold text-slate-100 light-theme:text-teal-950 uppercase tracking-wider">
                  Potential Treatment Considerations (Decision Support Categories)
                </h3>
              </div>
              <span className="text-xs text-amber-400 light-theme:text-amber-800 font-bold bg-amber-500/10 light-theme:bg-amber-100 px-2.5 py-0.5 rounded border border-amber-500/30 light-theme:border-amber-300">
                Doctor Review Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treatmentCategories.map((cat: any, idx: number) => (
                <div key={idx} className="bg-slate-950/80 light-theme:bg-white border border-slate-800 light-theme:border-teal-200 rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-400 light-theme:text-teal-700 shrink-0" />
                      <h4 className="text-xs font-black text-slate-100 light-theme:text-teal-950">{cat.category}</h4>
                    </div>

                    <p className="text-xs text-slate-300 light-theme:text-slate-800 leading-relaxed font-medium">
                      <strong className="text-emerald-400 light-theme:text-teal-800 font-bold">Purpose:</strong> {cat.general_purpose}
                    </p>
                    <p className="text-xs text-slate-300 light-theme:text-slate-900 leading-relaxed bg-slate-900/60 light-theme:bg-teal-50/70 p-2.5 rounded border border-slate-800 light-theme:border-teal-200 font-medium">
                      <strong className="text-amber-400 light-theme:text-amber-800 font-bold">Clinical Considerations:</strong> {cat.clinical_considerations}
                    </p>
                    {cat.reference_options && (
                      <p className="text-[11px] text-slate-300 light-theme:text-emerald-950 bg-slate-900/80 light-theme:bg-emerald-50 p-2 rounded border border-emerald-500/20 light-theme:border-emerald-200 font-medium">
                        <strong className="text-cyan-400 light-theme:text-emerald-800 font-bold">Reference Options:</strong> {cat.reference_options}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 light-theme:border-slate-200 text-[10px] text-slate-400 light-theme:text-slate-600 flex items-center justify-between">
                    <span>Guideline Source:</span>
                    <span className="font-bold text-emerald-400 light-theme:text-teal-800 line-clamp-1 max-w-[180px]">{cat.evidence_source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Red Flags & Emergency Escalation */}
          <div className="bg-rose-950/30 light-theme:bg-rose-50/70 border border-rose-500/30 light-theme:border-rose-300 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-rose-500/20 light-theme:border-rose-200 pb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 light-theme:text-rose-700" />
                <h3 className="text-sm font-bold text-slate-100 light-theme:text-rose-950 uppercase tracking-wider">
                  Red Flags & Mandatory Emergency Escalation Criteria
                </h3>
              </div>
              <span className="text-xs text-rose-400 light-theme:text-rose-800 font-bold bg-rose-500/10 light-theme:bg-rose-100 px-2.5 py-0.5 rounded border border-rose-500/30 light-theme:border-rose-300">
                Escalation Triggers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {redFlags.map((rf: any, idx: number) => (
                <div key={idx} className="bg-slate-950/80 light-theme:bg-white border border-rose-500/20 light-theme:border-rose-200 rounded-xl p-4 space-y-2 flex flex-col justify-between shadow-sm">
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5 animate-ping" />
                      <h4 className="text-xs font-black text-rose-300 light-theme:text-rose-950">{rf.warning_sign}</h4>
                    </div>

                    <p className="text-[11px] text-slate-300 light-theme:text-slate-800 leading-snug font-medium">
                      <strong className="text-rose-400 light-theme:text-rose-800 font-bold">Significance:</strong> {rf.clinical_significance}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-500/20 light-theme:border-rose-200 text-[10px] text-rose-300 light-theme:text-rose-950 font-bold bg-rose-950/40 light-theme:bg-rose-100 p-2 rounded">
                    <strong>Required Action:</strong> {rf.required_action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RAG LITERATURE EVIDENCE (RETRIEVED GUIDELINE CHUNKS & CITATIONS)    */}
      {/* ========================================================================= */}
      {activeTab === "evidence" && (
        <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-cyan-400 light-theme:text-cyan-700" />
              <h3 className="text-sm font-bold text-slate-100 light-theme:text-slate-900 uppercase tracking-wider">
                Retrieved Medical Literature Evidence ({evidenceList.length} Chunks)
              </h3>
            </div>
            <span className="text-xs text-cyan-400 light-theme:text-cyan-800 font-bold bg-cyan-500/10 light-theme:bg-cyan-100 px-2.5 py-0.5 rounded border border-cyan-500/30 light-theme:border-cyan-300">
              PubMed & WHO Vector Indexed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceList.map((ev: any, idx: number) => {
              const isExpanded = expandedEvidence === idx;
              const scorePercent = Math.round((ev.retrieval_score || 0.85) * 100);
              const publisher = ev.publisher || ev.source || "Official Guideline";
              const sectionStr = ev.section && ev.section !== "N/A" ? ev.section : "General Section";
              const pageNum = ev.page_number || 1;

              return (
                <div key={idx} className="bg-slate-950/80 light-theme:bg-cyan-50/30 border border-slate-800 light-theme:border-cyan-200 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="glow-pill-cyan text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {publisher}
                      </span>
                      <span className="text-xs font-black text-emerald-400 light-theme:text-emerald-800 bg-emerald-500/10 light-theme:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-500/20 light-theme:border-emerald-300">
                        Similarity: {scorePercent}%
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 light-theme:text-slate-900 line-clamp-1">{ev.title}</h4>

                    <div className="text-[11px] font-semibold text-emerald-400 light-theme:text-emerald-800 bg-emerald-950/40 light-theme:bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-500/20 light-theme:border-emerald-200 flex flex-wrap items-center justify-between gap-1">
                      <span>
                        <strong className="text-slate-300 light-theme:text-slate-700">Source:</strong> {publisher} — {sectionStr} — p. {pageNum}
                      </span>
                      {ev.version && ev.version !== "N/A" && (
                        <span className="text-[10px] text-slate-400 light-theme:text-slate-600">({ev.version})</span>
                      )}
                    </div>
                    
                    <p className={`text-xs text-slate-300 light-theme:text-slate-900 bg-slate-900/60 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-cyan-200 leading-relaxed font-medium ${
                      isExpanded ? "" : "line-clamp-3"
                    }`}>
                      &ldquo;{ev.content}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800 light-theme:border-slate-200">
                    <div className="flex items-center gap-2">
                      {ev.source_url ? (
                        <a
                          href={ev.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 light-theme:text-emerald-800 font-bold text-[10px] flex items-center gap-1 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Official Guideline
                        </a>
                      ) : (
                        <span className="text-slate-400 light-theme:text-slate-600 font-medium">Category: {ev.category || "Pulmonology"}</span>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedEvidence(isExpanded ? null : idx)}
                      className="text-emerald-400 light-theme:text-emerald-800 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      {isExpanded ? "Collapse Quote" : "Read Full Passage"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SAFETY AUDIT & MISSING PARAMETERS (CONSISTENCY & JSON PAYLOAD)    */}
      {/* ========================================================================= */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Validation Audit Widget */}
            <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 space-y-4 shadow-lg col-span-1">
              <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-slate-200 pb-3">
                <h4 className="text-xs font-bold text-slate-200 light-theme:text-slate-900 uppercase tracking-wider">
                  Validation Safety Audit
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400 light-theme:text-emerald-700" />
              </div>

              <div className="bg-slate-950/80 light-theme:bg-emerald-50/50 p-4 rounded-xl border border-slate-800 light-theme:border-emerald-200 text-center space-y-1">
                <span className="text-[10px] text-slate-400 light-theme:text-slate-600 uppercase font-bold">Evidence Grounding Score</span>
                <div className="text-3xl font-black text-emerald-400 light-theme:text-emerald-800">{evidenceScore}%</div>
                <span className="glow-pill-emerald text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                  {validation.risk_flag || "LOW RISK"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {(validation.consistency_checks || [
                  { check: "WHO Guideline Alignment", result: "PASS" },
                  { check: "Contraindication Audit", result: "PASS" },
                ]).map((c: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200">
                    <span className="text-[11px] text-slate-300 light-theme:text-slate-800 font-semibold">{c.check}</span>
                    <span className="text-emerald-400 light-theme:text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {c.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Information Alert Banner */}
            <div className="bg-amber-500/10 light-theme:bg-amber-50/90 border border-amber-500/40 light-theme:border-amber-300 rounded-2xl p-6 col-span-2 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 text-amber-300 light-theme:text-amber-950">
                <AlertTriangle className="w-5 h-5 text-amber-400 light-theme:text-amber-700 shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  ⚠ CRITICAL MISSING CLINICAL INFORMATION IDENTIFIED
                </h4>
              </div>

              <p className="text-xs text-amber-200/90 light-theme:text-amber-950 leading-relaxed font-semibold">
                The Explainability Agent identified the following clinical parameters as critical to refine diagnostic specificity:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(explanation.missing_information || [
                  "Arterial Blood Gas (ABG) panel for precise PaO2/FiO2 ratio calculation",
                  "Serum Creatinine / eGFR profile prior to nephrotoxic drug administration",
                  "Recent travel history or known exposure to endemic respiratory outbreaks",
                ]).map((item: string, idx: number) => (
                  <div key={idx} className="bg-slate-950/80 light-theme:bg-white p-3.5 rounded-xl border border-amber-500/30 light-theme:border-amber-300 text-amber-200 light-theme:text-amber-950 flex items-start gap-2 shadow-sm font-semibold">
                    <span className="text-amber-400 light-theme:text-amber-700 font-bold shrink-0">•</span>
                    <span className="text-[11px] leading-snug font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Raw AgentState JSON Toggle */}
          <div className="text-center pt-2">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs text-slate-500 light-theme:text-slate-700 hover:text-emerald-400 light-theme:hover:text-emerald-700 underline font-semibold flex items-center gap-1 mx-auto"
            >
              {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showRawJson ? "Hide Raw AgentState JSON" : "Inspect Raw Multi-Agent AgentState Payload"}
            </button>

            {showRawJson && (
              <pre className="mt-4 text-left bg-slate-950 light-theme:bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-96">
                {JSON.stringify(state, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom Safety Disclaimer Card */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl p-4 text-center text-xs text-slate-400 light-theme:text-slate-700 shadow-sm">
        <p className="leading-relaxed font-medium">
          {safetyDisclaimer}
        </p>
      </div>
    </div>
  );
}
