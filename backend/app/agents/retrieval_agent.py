import time
from sqlalchemy.orm import Session
from app.agents.state import AgentState
from app.rag.retriever import retrieve_relevant_medical_chunks

def run_retrieval_agent(state: AgentState, db: Session) -> AgentState:
    start_time = time.time()
    
    patient_info = state.patient_data
    symptoms = patient_info.get("symptoms", "")
    history = patient_info.get("medical_history", "")
    lab = patient_info.get("lab_results", "")
    
    query_text = f"Symptoms: {symptoms}. Medical History: {history}. Lab Results: {lab}"
    
    chunks = retrieve_relevant_medical_chunks(db, query_text, top_k=5, min_score=0.10)
    
    sources = []
    for c in chunks:
        sources.append({
            "chunk_id": c["chunk_id"],
            "title": c["title"],
            "publisher": c["publisher"],
            "source_url": c["source_url"],
            "version": c["version"],
            "category": c["category"],
            "section": c["section"],
            "page_number": c["page_number"],
            "content": c["content"],
            "retrieval_score": c["score"]
        })
        
    state.retrieved_evidence = sources
    
    execution_time = round((time.time() - start_time) * 1000, 2)
    state.execution_logs.append({
        "agent": "Retrieval Agent",
        "status": "COMPLETED",
        "duration_ms": execution_time,
        "summary": f"Retrieved {len(sources)} verifiable medical evidence chunks from official document store."
    })
    
    return state
