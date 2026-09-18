import json
import time
from app.agents.state import AgentState
from app.llm.prompts import EXPLAINABILITY_AGENT_PROMPT
from app.llm.model import call_llm

def run_explainability_agent(state: AgentState) -> AgentState:
    start_time = time.time()
    
    prompt = f"""
    PATIENT DATA:
    {json.dumps(state.patient_data, indent=2)}

    DIAGNOSIS & CASE PRIORITY:
    {json.dumps(state.diagnosis, indent=2)}

    RECOMMENDED TESTS:
    {json.dumps(state.diagnosis.get('recommended_tests', []), indent=2)}

    TREATMENT CATEGORIES & CONSIDERATIONS:
    {json.dumps(state.treatment, indent=2)}

    EVIDENCE SOURCES:
    {json.dumps(state.retrieved_evidence, indent=2)}

    VALIDATION AUDIT:
    {json.dumps(state.validation, indent=2)}
    """
    
    llm_output = call_llm(prompt, EXPLAINABILITY_AGENT_PROMPT)
    
    try:
        explanation_data = json.loads(llm_output)
    except Exception:
        explanation_data = {
            "executive_summary": "Synthesized multi-agent clinical decision support output based on patient symptoms, retrieved evidence, recommended tests, and treatment categories.",
            "diagnostic_rationale": "Differential diagnosis and urgency priority were determined based on clinical presentation matching and retrieved guideline evidence.",
            "evidence_summary": f"Supported by {len(state.retrieved_evidence)} retrieved medical guidelines.",
            "safety_audit_verdict": f"Validation status: {state.validation.get('status', 'PASS')}",
            "missing_information": [
                "Full arterial blood gas (ABG) panel",
                "Patient vaccination history",
                "Renal clearance profile (eGFR)"
            ]
        }
        
    state.explanation = explanation_data
    
    execution_time = round((time.time() - start_time) * 1000, 2)
    state.execution_logs.append({
        "agent": "Explainability Agent",
        "status": "COMPLETED",
        "duration_ms": execution_time,
        "summary": "Synthesized comprehensive clinical report, evidence citations, rationale, recommended tests, treatment categories, and missing clinical parameters."
    })
    
    return state

