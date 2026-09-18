"use client";

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  User,
  Activity,
  FileSpreadsheet,
  Upload,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Thermometer,
  Heart,
  Droplet,
} from "lucide-react";

interface ConsultationFormProps {
  onAnalyze: (formData: any) => void;
  presetCaseId?: string | null;
}

export default function ConsultationFormView({ onAnalyze, presetCaseId }: ConsultationFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields - Initialized empty for real user entry
  const [patientCode, setPatientCode] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [sex, setSex] = useState("Male");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("Moderate");
  const [associatedSymptoms, setAssociatedSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [wbc, setWbc] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [spo2, setSpo2] = useState("");

  const clearForm = () => {
    setPatientCode(`P${Math.floor(1000 + Math.random() * 9000)}`);
    setAge("");
    setSex("Male");
    setSymptoms("");
    setDuration("");
    setSeverity("Moderate");
    setAssociatedSymptoms("");
    setMedicalHistory("");
    setCurrentMedications("");
    setAllergies("");
    setBloodGlucose("");
    setBloodPressure("");
    setHba1c("");
    setWbc("");
    setCreatinine("");
    setSpo2("");
  };

  const applyPreset = (preset: string) => {
    if (preset === "pneumonia") {
      setPatientCode("P1027");
      setAge(45);
      setSex("Male");
      setSymptoms("High fever (38.9°C), productive cough with rust-colored sputum, acute dyspnea, right pleuritic chest pain.");
      setDuration("3 days");
      setSeverity("Severe");
      setAssociatedSymptoms("Tachypnea (RR 26 bpm), bronchial breath sounds & inspiratory crackles on right lower lobe.");
      setMedicalHistory("Type 2 Diabetes Mellitus (5 years).");
      setCurrentMedications("Metformin 850mg BD.");
      setAllergies("No known drug allergies.");
      setBloodGlucose("178");
      setBloodPressure("130/82");
      setHba1c("7.6");
      setWbc("15.8");
      setCreatinine("1.1");
      setSpo2("91%");
    } else if (preset === "dka") {
      setPatientCode("P1028");
      setAge(52);
      setSex("Female");
      setSymptoms("Severe polyuria, polydipsia, abdominal pain, nausea, vomiting, and progressive lethargy.");
      setDuration("2 days");
      setSeverity("Severe");
      setAssociatedSymptoms("Kussmaul hyperventilation, fruity acetone breath odor, reduced skin turgor.");
      setMedicalHistory("Uncontrolled Type 2 Diabetes Mellitus (10 years).");
      setCurrentMedications("Insulin Glargine 20 units at bedtime.");
      setAllergies("Sulfonamides.");
      setBloodGlucose("345");
      setBloodPressure("110/70");
      setHba1c("11.4");
      setWbc("13.5");
      setCreatinine("1.4");
      setSpo2("96%");
    } else if (preset === "malaria") {
      setPatientCode("P1031");
      setAge(28);
      setSex("Male");
      setSymptoms("High remittent fever (40.1°C) with shaking chills, drenching sweats, severe headache, jaundice, and altered consciousness.");
      setDuration("4 days");
      setSeverity("Severe");
      setAssociatedSymptoms("Hepatosplenomegaly, dark urine (blackwater), tachycardia (HR 118 bpm), generalized weakness.");
      setMedicalHistory("Recent travel to malaria-endemic rural region, no chemoprophylaxis.");
      setCurrentMedications("None.");
      setAllergies("No known drug allergies.");
      setBloodGlucose("68");
      setBloodPressure("100/62");
      setHba1c("5.4");
      setWbc("11.2");
      setCreatinine("1.5");
      setSpo2("94%");
    } else if (preset === "meningitis") {
      setPatientCode("P1032");
      setAge(34);
      setSex("Female");
      setSymptoms("Sudden onset high fever (39.5°C), excruciating global headache, marked neck stiffness (nuchal rigidity), and photophobia.");
      setDuration("18 hours");
      setSeverity("Critical");
      setAssociatedSymptoms("Positive Kernig and Brudzinski signs, petechial skin rash on lower extremities, altered mental status.");
      setMedicalHistory("Recent upper respiratory infection 1 week ago.");
      setCurrentMedications("Paracetamol 500mg as needed.");
      setAllergies("Penicillin (Anaphylaxis risk - use Vancomycin + Ceftriaxone).");
      setBloodGlucose("110");
      setBloodPressure("105/68");
      setHba1c("5.6");
      setWbc("18.4");
      setCreatinine("1.0");
      setSpo2("95%");
    } else if (preset === "tb") {
      setPatientCode("P1033");
      setAge(38);
      setSex("Male");
      setSymptoms("Persistent productive cough for 3 weeks with hemoptysis (blood-streaked sputum), drenching night sweats, and 6kg weight loss.");
      setDuration("3 weeks");
      setSeverity("Moderate");
      setAssociatedSymptoms("Low-grade evening fever (37.9°C), anorexia, fatigue, apical lung dullness on percussion.");
      setMedicalHistory("Smoker (15 pack-years), household contact with confirmed pulmonary TB case.");
      setCurrentMedications("None.");
      setAllergies("No known drug allergies.");
      setBloodGlucose("98");
      setBloodPressure("115/75");
      setHba1c("5.8");
      setWbc("12.1");
      setCreatinine("0.9");
      setSpo2("96%");
    } else if (preset === "heart_failure") {
      setPatientCode("P1034");
      setAge(67);
      setSex("Female");
      setSymptoms("Severe shortness of breath at rest, 3-pillow orthopnea, paroxysmal nocturnal dyspnea, and bilateral lower extremity pitting edema.");
      setDuration("5 days");
      setSeverity("Severe");
      setAssociatedSymptoms("Jugular venous distension (JVD 8cm), S3 gallop sound, bilateral lung base crackles.");
      setMedicalHistory("Ischemic Heart Disease (8 years), Longstanding Hypertension.");
      setCurrentMedications("Furosemide 40mg daily, Lisinopril 10mg daily, Metoprolol 50mg BD.");
      setAllergies("ACE Inhibitor cough.");
      setBloodGlucose("135");
      setBloodPressure("165/95");
      setHba1c("6.8");
      setWbc("8.4");
      setCreatinine("1.6");
      setSpo2("88%");
    } else if (preset === "chest_pain") {
      setPatientCode("P1029");
      setAge(61);
      setSex("Male");
      setSymptoms("Substernal crushing chest pressure radiating to left arm and jaw, diaphoresis, dyspnea at rest.");
      setDuration("45 minutes");
      setSeverity("Critical");
      setAssociatedSymptoms("Severe hypertension, anxiety, cool clammy skin.");
      setMedicalHistory("Essential Hypertension (12 years), Hyperlipidemia.");
      setCurrentMedications("Amlodipine 10mg daily, Atorvastatin 20mg daily.");
      setAllergies("No known drug allergies.");
      setBloodGlucose("142");
      setBloodPressure("185/115");
      setHba1c("6.4");
      setWbc("9.8");
      setCreatinine("1.2");
      setSpo2("95%");
    }
  };

  useEffect(() => {
    if (presetCaseId) {
      applyPreset(presetCaseId);
    } else {
      setPatientCode(`P${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [presetCaseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert("Please enter patient symptoms before running clinical analysis.");
      setCurrentStep(2);
      return;
    }

    const labParts = [];
    if (bloodGlucose) labParts.push(`Glucose: ${bloodGlucose} mg/dL`);
    if (bloodPressure) labParts.push(`BP: ${bloodPressure} mmHg`);
    if (hba1c) labParts.push(`HbA1c: ${hba1c}%`);
    if (wbc) labParts.push(`WBC: ${wbc} 10^3/µL`);
    if (creatinine) labParts.push(`Creatinine: ${creatinine} mg/dL`);
    if (spo2) labParts.push(`SpO2: ${spo2}`);

    const labResultsFormatted = labParts.length > 0 ? labParts.join(", ") : "Normal baseline vitals";
    const fullHistoryFormatted = `History: ${medicalHistory || "None reported"}. Meds: ${currentMedications || "None"}. Allergies: ${allergies || "No known allergies"}.`;

    onAnalyze({
      patient_code: patientCode || `P${Math.floor(1000 + Math.random() * 9000)}`,
      age: Number(age) || 35,
      sex,
      symptoms: `${symptoms}${duration ? ` (Duration: ${duration}` : ""}${severity ? `, Severity: ${severity})` : ""}${associatedSymptoms ? `. Associated: ${associatedSymptoms}` : ""}`,
      medical_history: fullHistoryFormatted,
      lab_results: labResultsFormatted,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Presets & Action Banner */}
      <div className="bg-slate-900/90 light-theme:bg-white border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 light-theme:text-teal-600" />
            <h3 className="text-xs font-bold text-slate-200 light-theme:text-slate-800 uppercase tracking-wider">
              1-Click Clinical Disease Test Cases
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearForm}
              className="text-[11px] bg-slate-900 light-theme:bg-slate-100 hover:bg-slate-800 light-theme:hover:bg-slate-200 text-teal-400 light-theme:text-teal-800 border border-teal-500/30 light-theme:border-slate-300 font-bold px-3 py-1 rounded-lg transition"
            >
              Clear Form / Blank Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => applyPreset("pneumonia")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-teal-500/50 light-theme:hover:border-teal-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🫁</span>
              <span className="text-[9px] font-bold text-teal-400 light-theme:text-teal-800 bg-teal-500/10 light-theme:bg-teal-100 px-1.5 py-0.5 rounded">Resp</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-teal-300 light-theme:group-hover:text-teal-700">Pneumonia</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">45M • SpO2 91%</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("dka")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-cyan-500/50 light-theme:hover:border-cyan-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🩸</span>
              <span className="text-[9px] font-bold text-cyan-400 light-theme:text-cyan-800 bg-cyan-500/10 light-theme:bg-cyan-100 px-1.5 py-0.5 rounded">Diabetes</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-cyan-300 light-theme:group-hover:text-cyan-700">DKA Crisis</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">52F • Glucose 345</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("malaria")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-amber-500/50 light-theme:hover:border-amber-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🦟</span>
              <span className="text-[9px] font-bold text-amber-400 light-theme:text-amber-800 bg-amber-500/10 light-theme:bg-amber-100 px-1.5 py-0.5 rounded">Vector</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-amber-300 light-theme:group-hover:text-amber-700">Falciparum Malaria</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">28M • Fever 40.1°C</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("meningitis")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-rose-500/50 light-theme:hover:border-rose-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🧠</span>
              <span className="text-[9px] font-bold text-rose-400 light-theme:text-rose-800 bg-rose-500/10 light-theme:bg-rose-100 px-1.5 py-0.5 rounded">Emergency</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-rose-300 light-theme:group-hover:text-rose-700">Bacterial Meningitis</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">34F • Stiff neck</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("tb")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-yellow-500/50 light-theme:hover:border-yellow-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🧫</span>
              <span className="text-[9px] font-bold text-yellow-400 light-theme:text-amber-800 bg-yellow-500/10 light-theme:bg-amber-100 px-1.5 py-0.5 rounded">TB</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-yellow-300 light-theme:group-hover:text-amber-700">Pulmonary TB</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">38M • Cough 3wks</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("heart_failure")}
            className="p-2.5 rounded-xl bg-slate-950/80 light-theme:bg-slate-50 border border-slate-800 light-theme:border-slate-200 hover:border-emerald-500/50 light-theme:hover:border-emerald-500 text-left transition flex flex-col justify-between group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-base">❤️</span>
              <span className="text-[9px] font-bold text-emerald-400 light-theme:text-emerald-800 bg-emerald-500/10 light-theme:bg-emerald-100 px-1.5 py-0.5 rounded">Cardiology</span>
            </div>
            <div className="mt-1">
              <p className="text-xs font-bold text-slate-100 light-theme:text-slate-900 group-hover:text-emerald-300 light-theme:group-hover:text-emerald-700">Acute Heart Failure</p>
              <p className="text-[9px] text-slate-400 light-theme:text-slate-600 font-medium">67F • Orthopnea</p>
            </div>
          </button>
        </div>
      </div>

      {/* Structured Wizard Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        {/* Wizard Step Progress Tracker */}
        <div className="flex items-center justify-between border-b border-slate-800 light-theme:border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 light-theme:bg-teal-50 border border-teal-500/30 light-theme:border-teal-200 text-teal-400 light-theme:text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 light-theme:text-slate-900">Patient Consultation Intake</h2>
              <p className="text-xs text-slate-400 light-theme:text-slate-600 font-medium">Step {currentStep} of 3: Clinical Intake Wizard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => setCurrentStep(stepNum as any)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition flex items-center justify-center ${
                  currentStep === stepNum
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20 font-black"
                    : currentStep > stepNum
                    ? "bg-teal-500/20 light-theme:bg-teal-100 text-teal-300 light-theme:text-teal-900 border border-teal-500/40 light-theme:border-teal-300"
                    : "bg-slate-950 light-theme:bg-slate-100 text-slate-500 light-theme:text-slate-600 border border-slate-800 light-theme:border-slate-300"
                }`}
              >
                {currentStep > stepNum ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 1: DEMOGRAPHICS */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-400 light-theme:text-teal-700 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" />
                Step 1 — Patient Demographics
              </h3>
              <span className="text-[11px] text-slate-500 light-theme:text-slate-600 font-medium">De-identified Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Patient ID / Code</label>
                <input
                  type="text"
                  value={patientCode}
                  placeholder="e.g. P1001"
                  onChange={(e) => setPatientCode(e.target.value)}
                  required
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  placeholder="e.g. 45"
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Biological Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-sm font-semibold focus:border-teal-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>Proceed to Symptoms</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SYMPTOMS & SEVERITY */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-400 light-theme:text-teal-700 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Step 2 — Symptom Presentation & Clinical Severity
              </h3>
              <span className="text-[11px] text-slate-500 light-theme:text-slate-600 font-medium">Chief Complaints</span>
            </div>

            <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-2 shadow-sm">
              <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Primary Symptoms <span className="text-teal-400 light-theme:text-teal-600">*</span></label>
              <textarea
                rows={3}
                value={symptoms}
                placeholder="Describe patient's chief complaints in detail (e.g. High fever 38.9°C, productive cough with purulent sputum, shortness of breath on exertion)..."
                onChange={(e) => setSymptoms(e.target.value)}
                required
                className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg p-3 text-xs leading-relaxed focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-2 shadow-sm">
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Clinical Severity Rating</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["Mild", "Moderate", "Severe", "Critical"].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        severity === sev
                          ? sev === "Critical"
                            ? "bg-rose-500/20 light-theme:bg-rose-100 text-rose-300 light-theme:text-rose-950 border border-rose-500/50 light-theme:border-rose-300 font-black"
                            : sev === "Severe"
                            ? "bg-amber-500/20 light-theme:bg-amber-100 text-amber-300 light-theme:text-amber-950 border border-amber-500/50 light-theme:border-amber-300 font-black"
                            : "bg-teal-500/20 light-theme:bg-teal-100 text-teal-300 light-theme:text-teal-950 border border-teal-500/50 light-theme:border-teal-300 font-black"
                          : "bg-slate-900 light-theme:bg-white text-slate-400 light-theme:text-slate-700 border border-slate-800 light-theme:border-slate-300 hover:text-slate-200"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-2 shadow-sm">
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Symptom Duration</label>
                <input
                  type="text"
                  value={duration}
                  placeholder="e.g. 3 days, 2 weeks"
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-xs font-semibold focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-2 shadow-sm">
              <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800">Associated Symptoms & Physical Examination</label>
              <input
                type="text"
                value={associatedSymptoms}
                placeholder="e.g. Pleuritic chest pain on inspiration, tachypnea (RR 26 bpm), inspiratory crackles..."
                onChange={(e) => setAssociatedSymptoms(e.target.value)}
                className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-medium"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="bg-slate-800 light-theme:bg-slate-100 text-slate-300 light-theme:text-slate-700 hover:bg-slate-700 border border-slate-700 light-theme:border-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
              >
                <span>Proceed to Labs & History</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MEDICAL HISTORY & LABS */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-400 light-theme:text-teal-700 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Step 3 — Medical History & Laboratory Vitals
              </h3>
              <span className="text-[11px] text-slate-500 light-theme:text-slate-600 font-medium">Diagnostic Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-[11px] font-bold text-slate-300 light-theme:text-slate-800">Previous Diseases</label>
                <input
                  type="text"
                  value={medicalHistory}
                  placeholder="e.g. Type 2 Diabetes, Hypertension..."
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>

              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-[11px] font-bold text-slate-300 light-theme:text-slate-800">Current Medications</label>
                <input
                  type="text"
                  value={currentMedications}
                  placeholder="e.g. Metformin 500mg, Amlodipine 5mg..."
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>

              <div className="bg-slate-950/70 light-theme:bg-slate-50 p-4 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-1.5 shadow-sm">
                <label className="block text-[11px] font-bold text-slate-300 light-theme:text-slate-800">Known Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  placeholder="e.g. Penicillin, Sulfa, None..."
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-slate-900 light-theme:bg-white border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-lg px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Vitals Grid Cards */}
            <div className="bg-slate-950/80 light-theme:bg-slate-50 p-5 rounded-xl border border-slate-800 light-theme:border-slate-200 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-slate-300 light-theme:text-slate-800 uppercase tracking-wider block">Laboratory Parameters & Vitals (Optional)</span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="bg-slate-900 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-slate-200 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 light-theme:text-slate-600 font-bold block">Blood Glucose</span>
                  <input
                    type="text"
                    value={bloodGlucose}
                    placeholder="120"
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 text-teal-300 light-theme:text-teal-800 font-bold text-xs text-center py-1 mt-1 rounded border border-slate-800 light-theme:border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-500 light-theme:text-slate-600 font-medium">mg/dL</span>
                </div>

                <div className="bg-slate-900 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-slate-200 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 light-theme:text-slate-600 font-bold block">Blood Pressure</span>
                  <input
                    type="text"
                    value={bloodPressure}
                    placeholder="120/80"
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 text-cyan-300 light-theme:text-cyan-800 font-bold text-xs text-center py-1 mt-1 rounded border border-slate-800 light-theme:border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-500 light-theme:text-slate-600 font-medium">mmHg</span>
                </div>

                <div className="bg-slate-900 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-slate-200 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 light-theme:text-slate-600 font-bold block">HbA1c</span>
                  <input
                    type="text"
                    value={hba1c}
                    placeholder="6.5"
                    onChange={(e) => setHba1c(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 text-slate-200 light-theme:text-slate-900 font-bold text-xs text-center py-1 mt-1 rounded border border-slate-800 light-theme:border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-500 light-theme:text-slate-600 font-medium">%</span>
                </div>

                <div className="bg-slate-900 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-slate-200 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 light-theme:text-slate-600 font-bold block">WBC Count</span>
                  <input
                    type="text"
                    value={wbc}
                    placeholder="7.5"
                    onChange={(e) => setWbc(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 text-slate-200 light-theme:text-slate-900 font-bold text-xs text-center py-1 mt-1 rounded border border-slate-800 light-theme:border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-500 light-theme:text-slate-600 font-medium">10^3/µL</span>
                </div>

                <div className="bg-slate-900 light-theme:bg-white p-3 rounded-lg border border-slate-800 light-theme:border-slate-200 text-center shadow-sm">
                  <span className="text-[10px] text-slate-400 light-theme:text-slate-600 font-bold block">Creatinine</span>
                  <input
                    type="text"
                    value={creatinine}
                    placeholder="1.0"
                    onChange={(e) => setCreatinine(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 text-slate-200 light-theme:text-slate-900 font-bold text-xs text-center py-1 mt-1 rounded border border-slate-800 light-theme:border-slate-300 focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-500 light-theme:text-slate-600 font-medium">mg/dL</span>
                </div>

                <div className="bg-slate-900 light-theme:bg-emerald-50 p-3 rounded-lg border border-teal-500/40 light-theme:border-teal-300 text-center shadow-sm">
                  <span className="text-[10px] text-teal-400 light-theme:text-teal-800 font-bold block">SpO2 Oxygen</span>
                  <input
                    type="text"
                    value={spo2}
                    placeholder="98%"
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-white text-teal-400 light-theme:text-teal-800 font-black text-xs text-center py-1 mt-1 rounded border border-teal-500/30 light-theme:border-teal-300 focus:border-teal-400 focus:outline-none"
                  />
                  <span className="text-[9px] text-teal-400 light-theme:text-teal-800 font-bold">% saturation</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800 light-theme:border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="bg-slate-800 light-theme:bg-slate-100 text-slate-300 light-theme:text-slate-700 hover:bg-slate-700 border border-slate-700 light-theme:border-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition transform active:scale-[0.98]"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span className="tracking-wide text-xs uppercase">Execute 5-Agent Clinical Pipeline</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
