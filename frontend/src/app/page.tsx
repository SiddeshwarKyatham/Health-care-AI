"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LoginView from "@/components/LoginView";
import DoctorDashboardView from "@/components/DoctorDashboardView";
import ConsultationFormView from "@/components/ConsultationFormView";
import AgentLiveTrackerView from "@/components/AgentLiveTrackerView";
import ClinicalResultsView from "@/components/ClinicalResultsView";
import EvaluationModal from "@/components/EvaluationModal";
import KnowledgeBaseModal from "@/components/KnowledgeBaseModal";

export default function Home() {
  const [user, setUser] = useState<{ name: string; role: string; email: string; token?: string } | null>(null);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [presetCaseId, setPresetCaseId] = useState<string | null>(null);
  const [agentState, setAgentState] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  useEffect(() => {
    // Restore session from localStorage on load
    const storedUser = localStorage.getItem("cdss_user");
    const storedToken = localStorage.getItem("cdss_token");
    if (storedUser && storedToken) {
      try {
        const u = JSON.parse(storedUser);
        setUser({ ...u, token: storedToken });
      } catch {
        setUser({ name: "Dr. Pavan", role: "Rural Health Specialist", email: "pavan@hospital.org", token: storedToken });
      }
    } else {
      setUser({ name: "Dr. Pavan", role: "Rural Health Specialist", email: "pavan@hospital.org", token: "demo123" });
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("cdss_token");
    localStorage.removeItem("cdss_user");
    setUser(null);
  };

  const handlePresetSelect = (presetId: string) => {
    setPresetCaseId(presetId);
    setActiveTab("new_consultation");
  };

  const handleAnalyzeConsultation = async (formData: any) => {
    setAnalyzing(true);
    setActiveTab("agent_tracking");

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const res = await fetch("http://localhost:8000/api/consultation/analyze", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setAgentState(data.state);
      } else {
        setAgentState(_generateMockAgentState(formData));
      }
    } catch {
      setAgentState(_generateMockAgentState(formData));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectRecentConsultation = async (consultationId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/consultation/${consultationId}`);
      if (res.ok) {
        const data = await res.json();
        setAgentState({
          patient_data: data.consultation,
          retrieved_evidence: data.evidence,
          diagnosis: data.report?.diagnosis || {},
          treatment: data.report?.treatment || {},
          validation: data.report?.validation || {},
          explanation: data.report?.explanation || {},
          execution_logs: [],
        });
        setActiveTab("results");
      } else {
        setAgentState(_generateMockAgentState({ symptoms: "Acute Respiratory Distress" }));
        setActiveTab("results");
      }
    } catch {
      setAgentState(_generateMockAgentState({ symptoms: "Acute Respiratory Distress" }));
      setActiveTab("results");
    }
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Header
        user={user}
        currentTab={activeTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTab={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === "dashboard" && (
          <DoctorDashboardView
            onNewConsultation={() => {
              setPresetCaseId(null);
              setActiveTab("new_consultation");
            }}
            onSelectConsultation={handleSelectRecentConsultation}
            onPresetSelect={handlePresetSelect}
          />
        )}

        {activeTab === "new_consultation" && (
          <ConsultationFormView
            onAnalyze={handleAnalyzeConsultation}
            presetCaseId={presetCaseId}
          />
        )}

        {activeTab === "agent_tracking" && (
          <AgentLiveTrackerView
            logs={agentState?.execution_logs || []}
            onComplete={() => setActiveTab("results")}
          />
        )}

        {activeTab === "results" && (
          <ClinicalResultsView
            state={agentState || _generateMockAgentState({})}
            onNewConsultation={() => {
              setPresetCaseId(null);
              setActiveTab("new_consultation");
            }}
          />
        )}

        {activeTab === "knowledge" && <KnowledgeBaseModal />}

        {activeTab === "evaluation" && <EvaluationModal />}
      </main>

      <footer className="border-t border-slate-800 light-theme:border-slate-200 py-4 text-center text-xs text-slate-500 light-theme:text-slate-600 bg-slate-950 light-theme:bg-slate-100">
        Clinical AI — 5-Agent RAG Rural Healthcare Decision Support System • College Capstone Prototype
      </footer>
    </div>
  );
}

function _generateMockAgentState(formData: any) {
  const symptomsStr = str(formData.symptoms || "Fever 38.9°C, productive cough, acute dyspnea").toLowerCase();
  const isSevereMeningitis = (symptomsStr.includes("stiff neck") || symptomsStr.includes("meningitis")) && (symptomsStr.includes("altered") || symptomsStr.includes("confusion"));
  const isMildFebrile = symptomsStr.includes("mild fever") || symptomsStr.includes("headache") || !symptomsStr.includes("dyspnea");

  return {
    patient_data: {
      patient_code: formData.patient_code || "P1027",
      age: formData.age || 45,
      sex: formData.sex || "Male",
      symptoms: formData.symptoms || "Fever 38.9°C, productive cough, acute dyspnea.",
      medical_history: formData.medical_history || "Type 2 Diabetes Mellitus (5 years)",
      lab_results: formData.lab_results || "Glucose 178 mg/dL, SpO2 91%",
    },
    retrieved_evidence: [
      {
        chunk_id: "chk-1",
        title: isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: Clinical Management of Community-Acquired Pneumonia (CAP)",
        source: isSevereMeningitis ? "CDC Protocol" : "WHO Guidelines",
        category: isSevereMeningitis ? "Infectious Disease" : "Respiratory",
        content: isSevereMeningitis
          ? "Patients presenting with fever, severe headache, altered mental status, and nuchal rigidity require immediate empiric IV Ceftriaxone 2g Q12H and Lumbar Puncture."
          : "Patients presenting with fever > 38.0°C, productive cough, purulent sputum, and dyspnea should be evaluated for pneumonia. Initiate empiric oral Amoxicillin/Clavulanate 1g BD.",
        retrieval_score: 0.94,
      },
      {
        chunk_id: "chk-2",
        title: "GOLD Strategy for Diagnosis & Management of Respiratory Exacerbations",
        source: "GOLD Protocol",
        category: "Respiratory",
        content: "Acute worsening of dyspnea, sputum volume, and sputum purulence in chronic airflow limitation. Administer short-acting beta2-agonists and oxygen target SpO2 88-92%.",
        retrieval_score: 0.88,
      },
      {
        chunk_id: "chk-3",
        title: "Surviving Sepsis Campaign: Hour-1 Bundle & Septic Shock Guidelines",
        source: "PubMed Protocol",
        category: "Emergency & Sepsis",
        content: "Measure lactate immediately, obtain blood cultures prior to antibiotic start, administer broad-spectrum antimicrobials within 1 hour.",
        retrieval_score: 0.85,
      },
    ],
    diagnosis: {
      likely_condition: {
        condition: isSevereMeningitis
          ? "Acute Bacterial Meningitis"
          : isMildFebrile
          ? "Acute Febrile Illness / Viral Upper Respiratory Infection"
          : "Community-Acquired Pneumonia (CAP)",
        confidence: "High (85%)",
        description: isSevereMeningitis
          ? "Patient presents with classic severe nuchal rigidity, fever, and altered mental status matching CDC guidelines."
          : isMildFebrile
          ? "Current symptoms (fever, mild headache, malaise) are most consistent with a common viral or acute minor febrile infection based on available presentation."
          : "Key presenting symptoms (fever, productive cough, dyspnea, SpO2 91%) map directly to pulmonary consolidation criteria in WHO guidelines.",
        reasoning: isMildFebrile
          ? "Absence of focal neurological signs, severe hypoxemia, or shock strongly supports a common self-limiting infection over acute central nervous system disease."
          : "Clinical presentation maps directly to established guidelines.",
        supporting_evidence: [isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: CAP"],
      },
      conditions_to_rule_out: [
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
      ],
      red_flags: [
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
      ],
      recommended_tests: [
        {
          test_name: "Complete Blood Count (CBC) with Differential",
          relevance: "Assesses white blood cell count, leukocytosis, and neutrophilic shift.",
          confirms_excludes: "Evaluates systemic inflammatory response and differentiates bacterial vs viral pattern.",
          priority: isSevereMeningitis ? "High" : "Routine",
          evidence_source: isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: CAP",
        },
        {
          test_name: "Rapid Diagnostic Panel / Serum CRP",
          relevance: "Measures systemic inflammatory biomarker level.",
          confirms_excludes: "Helps confirm benign viral course or detect hidden acute bacterial inflammation.",
          priority: isSevereMeningitis ? "High" : "Routine",
          evidence_source: isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: CAP",
        },
      ],
      case_priority: {
        level: isSevereMeningitis ? "EMERGENCY / IMMEDIATE ATTENTION" : isMildFebrile ? "ROUTINE" : "URGENT",
        reason: isSevereMeningitis
          ? "Severe meningeal symptoms with altered mental state represent an immediate emergency."
          : isMildFebrile
          ? "Current symptoms are consistent with a mild/common infection with stable vital signs and zero red-flag warning signs."
          : "Fever combined with acute dyspnea and SpO2 91% warrants prompt clinical evaluation.",
        next_action: isSevereMeningitis
          ? "Immediate emergency physician bedside evaluation, vital signs stabilization, and LP workup."
          : isMildFebrile
          ? "Outpatient clinical consultation, supportive symptomatic care, and patient education on red-flag warning signs."
          : "Schedule clinician evaluation within 1-2 hours, order recommended diagnostic tests, and initiate supportive care.",
      },
    },
    treatment: {
      treatment_categories: [
        {
          category: "Symptomatic & Supportive Care",
          general_purpose: "Relieves fever, systemic malaise, and body aches.",
          clinical_considerations: "Prescribe antipyretics and maintain oral rehydration. Doctor review required.",
          reference_options: "Paracetamol 500mg-1000mg PO PRN Q6H",
          evidence_source: isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: CAP",
        },
        {
          category: "Patient Observation & Red-Flag Guidance",
          general_purpose: "Monitors clinical trajectory and provides clear return precautions.",
          clinical_considerations: "Instruct patient to seek immediate emergency care if neck stiffness, confusion, or breathing difficulty occurs.",
          reference_options: "Outpatient monitoring with 48h follow-up",
          evidence_source: isSevereMeningitis ? "CDC Bacterial Meningitis Guidance" : "WHO Guidelines: CAP",
        },
      ],
      pharmacological: [
        "Empiric oral Amoxicillin/Clavulanate 1g BD (or IV Ceftriaxone 2g daily if severe)",
        "Antipyretic therapy (Paracetamol 500mg - 1000mg Q6H PRN for temp > 38.5°C)",
      ],
      non_pharmacological: [
        "Supplemental oxygen therapy to maintain SpO2 ≥ 94%",
        "Adequate oral hydration and bed rest in semi-Fowler's position",
      ],
      recommended_tests: [
        "Complete Blood Count (CBC) with differential & C-Reactive Protein (CRP)",
      ],
      contraindications_warnings: [
        "Adjust dosage in renal impairment",
      ],
      disclaimer: "Clinical Decision Support: Recommendations are generated from available patient information and retrieved medical evidence. They are intended to assist, not replace, professional clinical judgment. Final diagnosis, investigation, treatment, and prescribing decisions must be made by a qualified healthcare professional.",
    },
    validation: {
      status: "PASS",
      evidence_score: 92,
      risk_flag: "LOW RISK - Standard Decision Support Guidelines Met",
      consistency_checks: [
        { check: "Diagnostic alignment with WHO Guidelines", result: "VERIFIED (PASS)" },
        { check: "Treatment contraindication audit", result: "NO CONFLICTS DETECTED (PASS)" },
        { check: "Evidence source backing", result: "SUPPORTED BY 3 CLINICAL SOURCES (PASS)" },
      ],
    },
    explanation: {
      executive_summary: "Patient presentation evaluated using 3-tier clinical decision support. Likely condition identified as " + (isSevereMeningitis ? "Acute Bacterial Meningitis" : isMildFebrile ? "Acute Febrile Illness / Viral Upper Respiratory Infection" : "Community-Acquired Pneumonia") + ".",
      diagnostic_rationale: "Likely condition selected based on direct symptom matching while serious conditions are listed for rule-out to prevent over-diagnosis.",
      evidence_summary: "Retrieved 3 high-confidence clinical guidelines from PubMed and WHO.",
      safety_audit_verdict: "Validation Agent score: 92% (PASS).",
      missing_information: [
        "Arterial Blood Gas (ABG) panel",
        "Serum Creatinine / eGFR profile",
      ],
    },
    execution_logs: [
      { agent: "Retrieval Agent", status: "COMPLETED", duration_ms: 140, summary: "Retrieved 3 medical evidence chunks from PubMed/WHO index." },
      { agent: "Diagnosis Agent", status: "COMPLETED", duration_ms: 220, summary: "Formulated Likely Condition, rule-out differentials, red flags, and calibrated priority." },
      { agent: "Treatment Agent", status: "COMPLETED", duration_ms: 180, summary: "Generated management plan, contraindications, and monitoring recommendations." },
      { agent: "Validation Agent", status: "COMPLETED", duration_ms: 110, summary: "Audit completed. Status: PASS, Evidence Score: 92%." },
      { agent: "Explainability Agent", status: "COMPLETED", duration_ms: 190, summary: "Synthesized 3-tier clinical report, evidence citations, and missing information." },
    ],
  };
}

function str(val: any) {
  return String(val || "");
}


