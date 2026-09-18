from typing import Dict, Any, List
from pydantic import BaseModel, Field

class AgentState(BaseModel):
    patient_data: Dict[str, Any] = Field(default_factory=dict)
    retrieved_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    diagnosis: Dict[str, Any] = Field(default_factory=dict)
    treatment: Dict[str, Any] = Field(default_factory=dict)
    validation: Dict[str, Any] = Field(default_factory=dict)
    explanation: Dict[str, Any] = Field(default_factory=dict)
    execution_logs: List[Dict[str, Any]] = Field(default_factory=list)
