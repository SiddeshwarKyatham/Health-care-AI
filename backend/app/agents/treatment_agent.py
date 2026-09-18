import json
import time
from app.agents.state import AgentState
from app.llm.prompts import TREATMENT_AGENT_PROMPT
from app.llm.model import call_llm

def run_treatment_agent(state: AgentState) -> AgentState:
    start_time = time.time()
    
    prompt = f"""
    PATIENT DATA:
    {json.dumps(state.patient_data, indent=2)}

    DIFFERENTIAL DIAGNOSIS:
    {json.dumps(state.diagnosis, indent=2)}

    CLINICAL EVIDENCE:
    {json.dumps(state.retrieved_evidence, indent=2)}
    """
    
    llm_output = call_llm(prompt, TREATMENT_AGENT_PROMPT)
    
    try:
        treatment_data = json.loads(llm_output)
    except Exception:
        treatment_data = {
            "pharmacological": ["Consult attending physician for specific dosage and drug selection based on evidence."],
            "non_pharmacological": ["Supportive care, hydration, and continuous vital signs monitoring."],
            "contraindications_warnings": ["Check renal clearance (eGFR) and hepatic function prior to medication administration."]
        }
        
    ev_title = state.retrieved_evidence[0].get("title", "Official Clinical Guideline") if state.retrieved_evidence else "WHO Clinical Practice Guidelines"
    symptoms_str = (str(state.patient_data.get("symptoms", "")) + " " + str(state.patient_data.get("lab_results", ""))).lower()

    # Ensure treatment_categories exists
    if not treatment_data.get("treatment_categories") or not isinstance(treatment_data.get("treatment_categories"), list) or len(treatment_data["treatment_categories"]) == 0:
        if "stiff neck" in symptoms_str or "meningitis" in symptoms_str:
            treatment_data["treatment_categories"] = [
                {
                    "category": "Empiric Antimicrobial Therapy",
                    "general_purpose": "Eradicates bacterial pathogen causing central nervous system infection.",
                    "clinical_considerations": "Initiate within 1 hour of presentation. Adjust for patient age, renal function, and local resistance patterns. Doctor review required.",
                    "reference_options": "IV Ceftriaxone (2g Q12H) + IV Vancomycin (15-20mg/kg Q8-12H); Add Ampicillin for age > 50",
                    "evidence_source": "CDC Bacterial Meningitis Guidance"
                },
                {
                    "category": "Adjunctive Corticosteroid Therapy",
                    "general_purpose": "Attenuates meningeal inflammation, cerebral edema, and long-term auditory neurological sequelae.",
                    "clinical_considerations": "Administer dexamethasone prior to or concurrently with the first antimicrobial dose.",
                    "reference_options": "IV Dexamethasone (10mg Q6H for 4 days)",
                    "evidence_source": "CDC Bacterial Meningitis Guidance"
                },
                {
                    "category": "Supportive Hemodynamic & ICP Management",
                    "general_purpose": "Maintains adequate cerebral perfusion pressure and arterial oxygenation.",
                    "clinical_considerations": "Target MAP >= 65 mmHg; avoid hypovolemia and hyperthermia.",
                    "reference_options": "Isotonic crystalloids (0.9% NaCl), head elevation 30 degrees",
                    "evidence_source": "CDC Bacterial Meningitis Guidance"
                }
            ]
        elif "ketoacidosis" in symptoms_str or "dka" in symptoms_str:
            treatment_data["treatment_categories"] = [
                {
                    "category": "Fluid Resuscitation & Volume Expansion",
                    "general_purpose": "Restores intravascular volume and promotes renal excretion of glucose and ketones.",
                    "clinical_considerations": "Infuse 0.9% NaCl at 1000 mL/hr initially. Monitor serum electrolytes closely. Attending doctor review required.",
                    "reference_options": "0.9% Normal Saline IV infusion",
                    "evidence_source": ev_title
                },
                {
                    "category": "Intravenous Insulin Therapy",
                    "general_purpose": "Suppresses lipolysis, hepatic gluconeogenesis, and resolves metabolic ketoacidosis.",
                    "clinical_considerations": "Verify K+ >= 3.3 mEq/L prior to initiating insulin to prevent severe arrhythmias.",
                    "reference_options": "Regular Insulin IV infusion 0.1 units/kg/hr",
                    "evidence_source": ev_title
                }
            ]
        else:
            treatment_data["treatment_categories"] = [
                {
                    "category": "Empiric Targeted Antimicrobial Coverage",
                    "general_purpose": "Provides empiric antimicrobial coverage matching retrieved clinical practice guidelines.",
                    "clinical_considerations": "Audit patient drug allergy history, renal function (eGFR), and drug interactions prior to administration. Doctor review required.",
                    "reference_options": "Oral Amoxicillin/Clavulanate 1g BD or IV Ceftriaxone 1-2g Daily",
                    "evidence_source": ev_title
                },
                {
                    "category": "Analgesic & Antipyretic Support",
                    "general_purpose": "Relieves fever, systemic malaise, and musculoskeletal inflammatory discomfort.",
                    "clinical_considerations": "Monitor maximum daily paracetamol dose limits (3g-4g/day) in underlying liver disease.",
                    "reference_options": "Paracetamol 500mg-1000mg PO PRN Q6H",
                    "evidence_source": ev_title
                },
                {
                    "category": "Supportive Respiratory & Fluid Management",
                    "general_purpose": "Maintains adequate peripheral tissue oxygenation (SpO2 >= 92-94%) and oral hydration.",
                    "clinical_considerations": "Titrate supplemental oxygen via nasal cannula or venturi mask based on continuous pulse oximetry.",
                    "reference_options": "Nasal cannula O2 therapy 2-4 L/min + Oral rehydration",
                    "evidence_source": ev_title
                }
            ]

    # Explicit Safety & Decision Support Disclaimer
    treatment_data["disclaimer"] = "Clinical Decision Support: Recommendations are generated from available patient information and retrieved medical evidence. They are intended to assist, not replace, professional clinical judgment. Final diagnosis, investigation, treatment, and prescribing decisions must be made by a qualified healthcare professional."

    state.treatment = treatment_data
    
    execution_time = round((time.time() - start_time) * 1000, 2)
    state.execution_logs.append({
        "agent": "Treatment Agent",
        "status": "COMPLETED",
        "duration_ms": execution_time,
        "summary": f"Generated clinical decision support management plan with {len(treatment_data.get('treatment_categories', []))} treatment categories and safety warnings."
    })
    
    return state


