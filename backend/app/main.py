import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base, SessionLocal
from app.api import auth, patients, consultation, knowledge, evaluation
from app.services.seeder import seed_knowledge_base_if_empty

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical LLM + RAG Multi-Agent CDSS API",
    description="Clinical Decision Support System with 5-Agent Architecture (Retrieval, Diagnosis, Treatment, Validation, Explainability)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(consultation.router)
app.include_router(knowledge.router)
app.include_router(evaluation.router)

@app.on_event("startup")
def on_startup():
    # Seed knowledge base with PubMed, WHO, ACC/AHA, ADA clinical guidelines on launch
    db = SessionLocal()
    try:
        seed_knowledge_base_if_empty(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Medical LLM RAG Multi-Agent Clinical Decision Support System",
        "agents": [
            "Retrieval Agent",
            "Diagnosis Agent",
            "Treatment Agent",
            "Validation Agent",
            "Explainability Agent"
        ]
    }
