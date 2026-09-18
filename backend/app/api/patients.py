import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Patient

router = APIRouter(prefix="/api/patients", tags=["Patients"])

class PatientCreate(BaseModel):
    patient_code: Optional[str] = None
    age: int
    sex: str
    medical_history: Optional[str] = ""

class PatientResponse(BaseModel):
    id: str
    patient_code: str
    age: int
    sex: str
    medical_history: Optional[str]

    class Config:
        from_attributes = True

@router.get("", response_model=List[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.post("", response_model=PatientResponse)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    code = data.patient_code or f"PAT-{random.randint(1000, 9999)}"
    patient = Patient(
        patient_code=code,
        age=data.age,
        sex=data.sex,
        medical_history=data.medical_history
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient
