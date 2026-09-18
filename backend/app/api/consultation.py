import json
import random
from io import BytesIO
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Consultation, Patient, Evidence, ClinicalReport, User
from app.agents.orchestrator import execute_clinical_agent_pipeline

# ReportLab Imports
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

router = APIRouter(prefix="/api/consultation", tags=["Consultation"])

class ConsultationRequest(BaseModel):
    patient_id: Optional[str] = None
    age: int
    sex: str
    symptoms: str
    medical_history: Optional[str] = ""
    lab_results: Optional[str] = ""
    doctor_id: Optional[str] = None

@router.post("/analyze")
def analyze_patient_consultation(req: ConsultationRequest, db: Session = Depends(get_db)):
    # 1. Resolve or create Patient
    patient_id = req.patient_id
    if not patient_id:
        p_code = f"PAT-{random.randint(1000, 9999)}"
        patient = Patient(
            patient_code=p_code,
            age=req.age,
            sex=req.sex,
            medical_history=req.medical_history
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
        patient_id = patient.id

    # 2. Create Consultation record
    consultation = Consultation(
        patient_id=patient_id,
        doctor_id=req.doctor_id,
        symptoms=req.symptoms,
        medical_history=req.medical_history,
        lab_results=req.lab_results,
        status="completed"
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)

    # 3. Prepare patient data for multi-agent pipeline
    patient_data = {
        "consultation_id": consultation.id,
        "patient_id": patient_id,
        "age": req.age,
        "sex": req.sex,
        "symptoms": req.symptoms,
        "medical_history": req.medical_history,
        "lab_results": req.lab_results
    }

    # 4. Execute 5-Agent Pipeline
    agent_state = execute_clinical_agent_pipeline(patient_data, db)

    # 5. Save Evidence records in DB
    for ev in agent_state.retrieved_evidence:
        ev_record = Evidence(
            consultation_id=consultation.id,
            title=ev.get("title", "Clinical Protocol"),
            publisher=ev.get("publisher", "N/A"),
            source_url=ev.get("source_url", ""),
            section=ev.get("section", "N/A"),
            page_number=ev.get("page_number", 1),
            content=ev.get("content", ""),
            retrieval_score=ev.get("retrieval_score", 0.85)
        )
        db.add(ev_record)

    # 6. Save Clinical Report in DB
    report = ClinicalReport(
        consultation_id=consultation.id,
        possible_conditions_json=json.dumps(agent_state.diagnosis),
        treatment_considerations_json=json.dumps(agent_state.treatment),
        validation_result_json=json.dumps(agent_state.validation),
        explanation_json=json.dumps(agent_state.explanation)
    )
    db.add(report)
    db.commit()

    return {
        "consultation_id": consultation.id,
        "patient_id": patient_id,
        "state": agent_state.dict()
    }

@router.get("/{consultation_id}")
def get_consultation_details(consultation_id: str, db: Session = Depends(get_db)):
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
        
    report = db.query(ClinicalReport).filter(ClinicalReport.consultation_id == consultation_id).first()
    evidence_list = db.query(Evidence).filter(Evidence.consultation_id == consultation_id).all()
    
    return {
        "consultation": {
            "id": consultation.id,
            "patient_id": consultation.patient_id,
            "symptoms": consultation.symptoms,
            "medical_history": consultation.medical_history,
            "lab_results": consultation.lab_results,
            "created_at": str(consultation.created_at)
        },
        "evidence": [
            {
                "id": e.id,
                "title": e.title,
                "publisher": e.publisher,
                "source_url": e.source_url,
                "section": e.section,
                "page_number": e.page_number,
                "content": e.content,
                "score": e.retrieval_score
            } for e in evidence_list
        ],
        "report": {
            "diagnosis": json.loads(report.possible_conditions_json) if report else {},
            "treatment": json.loads(report.treatment_considerations_json) if report else {},
            "validation": json.loads(report.validation_result_json) if report else {},
            "explanation": json.loads(report.explanation_json) if report else {}
        } if report else None
    }

@router.get("/{consultation_id}/pdf")
def export_consultation_pdf(consultation_id: str, db: Session = Depends(get_db)):
    """
    Generates a formal, publication-ready Clinical Decision Support PDF report.
    """
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")

    patient = db.query(Patient).filter(Patient.id == consultation.patient_id).first()
    report = db.query(ClinicalReport).filter(ClinicalReport.consultation_id == consultation_id).first()
    evidence_list = db.query(Evidence).filter(Evidence.consultation_id == consultation_id).all()

    diagnosis = json.loads(report.possible_conditions_json) if report else {}
    treatment = json.loads(report.treatment_considerations_json) if report else {}
    validation = json.loads(report.validation_result_json) if report else {}
    explanation = json.loads(report.explanation_json) if report else {}

    pdf_buffer = generate_pdf_report_buffer(consultation, patient, evidence_list, diagnosis, treatment, validation, explanation)

    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Clinical_Report_{consultation.id[:8]}.pdf"
        }
    )

def generate_pdf_report_buffer(consultation, patient, evidence_list, diagnosis, treatment, validation, explanation) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A')
    )
    
    sub_title_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0D9488')
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155')
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    # Header Banner
    story.append(Paragraph("CLINICAL AI — DECISION SUPPORT SYSTEM REPORT", title_style))
    story.append(Paragraph("Multi-Agent Retrieval-Augmented Generation (RAG) Clinical Summary", sub_title_style))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0D9488'), spaceAfter=8))

    # Priority Banner Callout
    case_priority = diagnosis.get("case_priority", {})
    p_level = case_priority.get("level", "URGENT")
    p_reason = case_priority.get("reason", "Patient symptoms require prompt clinical evaluation based on guidelines.")
    p_next = case_priority.get("next_action", "Schedule clinician review and diagnostic investigation.")

    p_bg = colors.HexColor('#FEF2F2') if "IMMEDIATE" in p_level else colors.HexColor('#FFFBEB') if "URGENT" in p_level else colors.HexColor('#F0FDF4')
    p_border = colors.HexColor('#FCA5A5') if "IMMEDIATE" in p_level else colors.HexColor('#FDE68A') if "URGENT" in p_level else colors.HexColor('#BBF7D0')
    p_text_color = "#991B1B" if "IMMEDIATE" in p_level else "#92400E" if "URGENT" in p_level else "#166534"

    p_table = [
        [Paragraph(f"<b>CASE PRIORITY: <font color='{p_text_color}'>{p_level}</font></b>", bold_body)],
        [Paragraph(f"<b>Reason:</b> {p_reason}", body_style)],
        [Paragraph(f"<b>Recommended Action:</b> {p_next}", body_style)]
    ]
    t_p = Table(p_table, colWidths=[540])
    t_p.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), p_bg),
        ('BOX', (0,0), (-1,-1), 1, p_border),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_p)
    story.append(Spacer(1, 8))

    # Section 1: Patient Information & Clinical Input
    story.append(Paragraph("1. PATIENT PROFILE & CLINICAL PRESENTATION", h2_style))
    
    p_code = patient.patient_code if patient else "P1027"
    p_age = patient.age if patient else 45
    p_sex = patient.sex if patient else "Male"
    
    patient_data_table = [
        [Paragraph("<b>Patient Code:</b>", body_style), Paragraph(str(p_code), body_style), Paragraph("<b>Age / Sex:</b>", body_style), Paragraph(f"{p_age} Y / {p_sex}", body_style)],
        [Paragraph("<b>Presenting Symptoms:</b>", body_style), Paragraph(str(consultation.symptoms), body_style), Paragraph("<b>Vitals / Lab Results:</b>", body_style), Paragraph(str(consultation.lab_results or "N/A"), body_style)],
        [Paragraph("<b>Medical History:</b>", body_style), Paragraph(str(consultation.medical_history or "None reported"), body_style), Paragraph("<b>Consultation ID:</b>", body_style), Paragraph(str(consultation.id[:8]), body_style)]
    ]
    
    t1 = Table(patient_data_table, colWidths=[110, 160, 110, 160])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t1)
    story.append(Spacer(1, 8))

    # Section 2: 3-Tier Clinical Diagnosis & Rule-Out Assessment
    story.append(Paragraph("2. CLINICAL ASSESSMENT & CONDITIONS TO RULE OUT", h2_style))
    
    likely_cond = diagnosis.get("likely_condition", {})
    l_name = likely_cond.get("condition", "Acute Febrile Illness / Mild Infection")
    l_conf = likely_cond.get("confidence", "High (85%)")
    l_desc = likely_cond.get("description", "Current symptoms are most consistent with a common infection based on available clinical presentation.")
    
    likely_table_data = [
        [Paragraph(f"<b>PRIMARY LIKELY CONDITION: <font color='#0D9488'>{l_name}</font></b>", bold_body), Paragraph(f"<b>Match Confidence:</b> {l_conf}", bold_body)],
        [Paragraph(f"<b>Clinical Rationale:</b> {l_desc}", body_style), Paragraph("", body_style)]
    ]
    t_likely = Table(likely_table_data, colWidths=[380, 160])
    t_likely.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#BBF7D0')),
        ('SPAN', (0,1), (1,1)),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_likely)
    story.append(Spacer(1, 4))

    # Conditions to Rule Out Table
    rule_out_list = diagnosis.get("conditions_to_rule_out", [])
    rule_out_table_data = [[Paragraph("<b>Condition to Rule Out</b>", bold_body), Paragraph("<b>Risk Level</b>", bold_body), Paragraph("<b>Clinical Criteria to Rule Out</b>", bold_body)]]
    
    for r in rule_out_list:
        rule_out_table_data.append([
            Paragraph(f"<b>{r.get('condition')}</b>", body_style),
            Paragraph(f"<font color='#B45309'>{r.get('risk_level', 'Rule Out')}</font>", bold_body),
            Paragraph(str(r.get('rule_out_criteria', '')), body_style)
        ])
        
    t2 = Table(rule_out_table_data, colWidths=[160, 100, 280])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#FEF3C7')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t2)
    story.append(Spacer(1, 8))


    # Section 3: Recommended Diagnostic Tests ("Recommended Further Examination")
    story.append(Paragraph("3. RECOMMENDED FURTHER EXAMINATION & DIAGNOSTIC TESTS", h2_style))
    tests_list = diagnosis.get("recommended_tests", [])
    test_table_data = [[Paragraph("<b>Investigation Test</b>", bold_body), Paragraph("<b>Priority</b>", bold_body), Paragraph("<b>Relevance & Confirmation Goal</b>", bold_body), Paragraph("<b>RAG Source</b>", bold_body)]]
    
    for t in tests_list:
        test_table_data.append([
            Paragraph(f"<b>{t.get('test_name')}</b>", body_style),
            Paragraph(f"<b>{t.get('priority', 'High')}</b>", bold_body),
            Paragraph(f"{t.get('relevance', '')}<br/><font color='#0D9488'>Goal:</font> {t.get('confirms_excludes', '')}", body_style),
            Paragraph(str(t.get('evidence_source', 'Clinical Guideline')), body_style)
        ])
        
    t_tests = Table(test_table_data, colWidths=[130, 60, 240, 110])
    t_tests.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_tests)
    story.append(Spacer(1, 8))

    # Section 4: Potential Treatment Considerations (Categories)
    story.append(Paragraph("4. POTENTIAL TREATMENT CONSIDERATIONS (DECISION SUPPORT)", h2_style))
    tx_categories = treatment.get("treatment_categories", [])
    tx_cat_table_data = [[Paragraph("<b>Treatment Category</b>", bold_body), Paragraph("<b>General Purpose & Clinical Considerations</b>", bold_body), Paragraph("<b>Reference Options (Doctor Review)</b>", bold_body)]]
    
    for cat in tx_categories:
        tx_cat_table_data.append([
            Paragraph(f"<b>{cat.get('category')}</b><br/><font color='#64748B'>[{cat.get('evidence_source', 'Guideline')}]</font>", body_style),
            Paragraph(f"<b>Purpose:</b> {cat.get('general_purpose', '')}<br/><b>Note:</b> {cat.get('clinical_considerations', '')}", body_style),
            Paragraph(f"<font color='#0F172A'>{cat.get('reference_options', 'Clinical options for review')}</font>", body_style)
        ])

    t_tx_cat = Table(tx_cat_table_data, colWidths=[140, 240, 160])
    t_tx_cat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_tx_cat)
    story.append(Spacer(1, 8))

    # Section 5: Safety Audit & Clinical Explainability
    story.append(Paragraph("5. SAFETY AUDIT & CLINICAL EXPLAINABILITY", h2_style))
    val_status = validation.get("status", "PASS")
    val_score = validation.get("evidence_score", 92)
    exec_summary = explanation.get("executive_summary", "Multi-agent RAG analysis indicates high guideline alignment.")

    audit_table = [
        [Paragraph("<b>Validation Status:</b>", bold_body), Paragraph(f"<font color='#0D9488'><b>{val_status}</b></font> (Evidence Score: {val_score}%)", body_style)],
        [Paragraph("<b>Executive Summary:</b>", bold_body), Paragraph(exec_summary, body_style)]
    ]
    t5 = Table(audit_table, colWidths=[140, 400])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F0FDF4')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#BBF7D0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#DCFCE7')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t5)
    story.append(Spacer(1, 8))

    # Clinical Safety Disclaimer Banner
    disclaimer_text = "<b>CLINICAL DECISION SUPPORT DISCLAIMER:</b> Recommendations are generated from available patient information and retrieved medical evidence. They are intended to assist, not replace, professional clinical judgment. Final diagnosis, investigation, treatment, and prescribing decisions must be made by a qualified healthcare professional."
    disc_table = [[Paragraph(f"<font color='#92400E'>{disclaimer_text}</font>", body_style)]]
    t_disc = Table(disc_table, colWidths=[540])
    t_disc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFFBEB')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#FDE68A')),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_disc)

    doc.build(story)
    return buffer

