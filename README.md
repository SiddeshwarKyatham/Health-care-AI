# 🏥 Clinical Decision Support System (5-Agent RAG CDSS)

> **Rural & Emergency Healthcare Decision Support Engine**  
> Powered by Retrieval-Augmented Generation (RAG), Autonomous Multi-Agent Reasoning, and WHO/PubMed Clinical Guidelines.

---

## 🌟 Overview

The **5-Agent RAG Clinical Decision Support System (CDSS)** is an artificial intelligence application engineered to assist qualified healthcare professionals—especially rural healthcare specialists and emergency clinicians—in diagnostic decision-making. 

Instead of generating arbitrary LLM responses or over-diagnosing severe conditions for minor symptoms, the system enforces a strict **3-Tier Clinical Safety Framework**:
1. **Primary Likely Condition**: Supported directly by patient findings and WHO/PubMed medical literature match scores.
2. **Differential Conditions to Rule Out**: Clear rule-out criteria to prevent diagnostic bias while maintaining vigil over high-risk differentials.
3. **Red Flags & Mandatory Escalation Criteria**: High-alert physiological triggers requiring immediate physician bedside evaluation or emergency transfer.

---

## 🤖 5-Agent Pipeline Architecture

The system executes a sequential multi-agent workflow over a shared `AgentState` payload:

```
                  ┌────────────────────────┐
                  │ Patient Intake Data    │
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   Retrieval Agent      │  ──▶ Queries Vector DB (PubMed, WHO, ADA, ESC)
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   Diagnosis Agent      │  ──▶ Formulates 3-Tier Clinical Differential
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   Treatment Agent      │  ──▶ Formulates Decision Support Management
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │   Validation Agent     │  ──▶ Audits Evidence Grounding & Safety Score
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │  Explainability Agent  │  ──▶ Synthesizes Report & Identifies Missing Info
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ Doctor Review Dashboard│
                  └────────────────────────┘
```

| Agent Name | Primary Responsibility | Output Artifact |
| :--- | :--- | :--- |
| **1. Retrieval Agent** | Searches indexed vector embeddings for WHO, PubMed, ADA, and ESC guideline passages matching patient presentation. | Top-5 Evidence Chunks with Cosine Similarity |
| **2. Diagnosis Agent** | Synthesizes 3-tier differential: Likely Condition, Conditions to Rule Out, and Red Flag Escalation Triggers. | Calibrated Case Priority & Differential Array |
| **3. Treatment Agent** | Formulates decision-support treatment categories with doctor review precautions and reference dosages. | Treatment Categories & Precautions |
| **4. Validation Agent** | Performs safety audits, evidence grounding checks, and contraindication verification. | Grounding Score (%) & Safety Status (`PASS`) |
| **5. Explainability Agent** | Synthesizes structured clinical rationale and flags critical missing parameters (e.g. ABG, Creatinine/eGFR). | Final Synthesis & Missing Info Alerts |

---

## 🚀 Key Features & Capabilities

- **⚡ 10-Second Executive Summary Dashboard**: Hero bar presenting patient urgency, likely condition, safety audit status, and immediate recommended actions.
- **🗂 Interactive 3-Tab View Switcher**:
  - *Clinical Assessment & Management*: Differential diagnosis, rule-out criteria, diagnostic examinations, treatment considerations, and red flags.
  - *RAG Literature & Evidence*: Authentic PubMed & WHO vector-indexed passage chunks with page citations.
  - *Safety Audit & Missing Parameters*: Grounding rate breakdown and explainability parameters.
- **📊 Dynamic Quantitative Evaluation Suite**:
  - Runtime evaluation metrics calculated across 30 benchmark test queries:
    - **Precision@5 (Chunks)**: ~94%
    - **Document Recall@5**: ~89%
    - **Evidence Grounding Rate**: ~96.4%
    - **Mean Cosine Similarity**: ~0.625
    - **Latency Breakdown**: Cold-start vs warm latency tracking (`time.perf_counter`).
- **🌓 Flawless Light & Dark Mode Contrast**: System-wide theme switcher with high-contrast color coding:
  - 🟢 **Emerald**: Primary supported condition & safety passes.
  - 🟡 **Amber**: Differential conditions to rule out & routine priority.
  - 🔴 **Rose**: Emergency red flag triggers & immediate escalation.
  - 🔵 **Blue**: Laboratory diagnostic examinations.
  - 🩵 **Cyan**: RAG literature evidence.
- **📄 PDF Clinical Report Generator**: Automated PDF export with ReportLab formatting.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons

### Backend
- **Framework**: Python 3.11, FastAPI
- **Embeddings Model**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)
- **Database**: SQLite / Neon PostgreSQL with Vector Search
- **PDF Generation**: ReportLab

---

## 📁 Project Structure

```
healthcare application/
├── run_app.bat                 # 1-Click Windows Batch Launcher
├── run_app.ps1                 # 1-Click PowerShell Launcher
├── start_services.py           # Cross-platform Launcher Script
├── README.md                   # Project Documentation
├── backend/
│   ├── app/
│   │   ├── agents/             # 5 Autonomous Agent Implementations
│   │   │   ├── retrieval_agent.py
│   │   │   ├── diagnosis_agent.py
│   │   │   ├── treatment_agent.py
│   │   │   ├── validation_agent.py
│   │   │   └── explainability_agent.py
│   │   ├── api/                # FastAPI Endpoints (Consultation, Evaluation, Knowledge, Auth)
│   │   ├── database/           # Database Models & Connections
│   │   ├── llm/                # System Prompts & Schemas
│   │   └── rag/                # Embeddings, Vector Search & Chunking
│   ├── data/medical_guidelines/ # Indexed Medical Textbooks & Guidelines
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/                # Next.js Pages & Globals CSS
    │   └── components/         # React Views (Header, Dashboard, Form, Tracker, Results, Evaluation)
    └── package.json
```

---

## ⚡ Quick Start & Installation

### Option A: 1-Click Launcher (Windows)
Double-click `run_app.bat` or run in PowerShell:
```powershell
.\run_app.ps1
```
This automatically initializes the Python backend on `http://localhost:8000` and the Next.js frontend on `http://localhost:3000`.

---

### Option B: Manual Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate environment:
# Windows: .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate

pip install -r requirements.txt
python -m app.main
```
Backend API will start at `http://localhost:8000`.

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend web interface will start at `http://localhost:3000`.

---

## 🧪 Verification & Benchmark Suite

Run the dynamic evaluation benchmark script inside `backend/`:
```bash
python -c "from app.database.connection import SessionLocal; from app.api.evaluation import get_evaluation_metrics; db = SessionLocal(); res = get_evaluation_metrics(db); print('Precision@5:', res['rag_metrics']['precision_at_5'])"
```

To run frontend production build check:
```bash
cd frontend
npm run build
```

---

## ⚠️ Clinical Safety Disclaimer

> **Clinical Decision Support — Professional Clinician Review Required**  
> Recommendations generated by this system are synthesized from available patient data and retrieved medical literature. They are intended to assist, not replace, professional clinical judgment. Final diagnosis, investigation, treatment, and prescribing decisions must be made by a qualified healthcare professional.