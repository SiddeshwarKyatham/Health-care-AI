from sqlalchemy.orm import Session
from app.agents.state import AgentState
from app.agents.retrieval_agent import run_retrieval_agent
from app.agents.diagnosis_agent import run_diagnosis_agent
from app.agents.treatment_agent import run_treatment_agent
from app.agents.validation_agent import run_validation_agent
from app.agents.explainability_agent import run_explainability_agent

def execute_clinical_agent_pipeline(patient_data: dict, db: Session) -> AgentState:
    """
    Executes the 5-Agent Clinical Pipeline sequentially:
    1. Retrieval Agent  -> Populates state.retrieved_evidence
    2. Diagnosis Agent  -> Populates state.diagnosis
    3. Treatment Agent  -> Populates state.treatment
    4. Validation Agent -> Populates state.validation
    5. Explainability Agent -> Populates state.explanation
    """
    state = AgentState(patient_data=patient_data)
    
    # Step 1: Retrieval Agent
    state = run_retrieval_agent(state, db)
    
    # Step 2: Diagnosis Agent
    state = run_diagnosis_agent(state)
    
    # Step 3: Treatment Agent
    state = run_treatment_agent(state)
    
    # Step 4: Validation Agent
    state = run_validation_agent(state)
    
    # Step 5: Explainability Agent
    state = run_explainability_agent(state)
    
    return state
