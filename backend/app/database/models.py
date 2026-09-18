import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database.connection import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="doctor")
    created_at = Column(DateTime, default=datetime.utcnow)

    consultations = relationship("Consultation", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_code = Column(String, unique=True, index=True, nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String, nullable=False)
    medical_history = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    consultations = relationship("Consultation", back_populates="patient")

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, default=generate_uuid)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("users.id"), nullable=True)
    symptoms = Column(Text, nullable=False)
    medical_history = Column(Text, nullable=True)
    lab_results = Column(Text, nullable=True)
    status = Column(String, default="completed") # pending, processing, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="consultations")
    doctor = relationship("User", back_populates="consultations")
    evidence = relationship("Evidence", back_populates="consultation", cascade="all, delete-orphan")
    reports = relationship("ClinicalReport", back_populates="consultation", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    consultation_id = Column(String, ForeignKey("consultations.id"), nullable=False)
    title = Column(String, nullable=False)
    publisher = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    section = Column(String, nullable=True)
    page_number = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    retrieval_score = Column(Float, nullable=False)

    consultation = relationship("Consultation", back_populates="evidence")

class ClinicalReport(Base):
    __tablename__ = "clinical_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    consultation_id = Column(String, ForeignKey("consultations.id"), nullable=False)
    possible_conditions_json = Column(Text, nullable=False) # Stored as JSON string
    treatment_considerations_json = Column(Text, nullable=False) # Stored as JSON string
    validation_result_json = Column(Text, nullable=False) # Stored as JSON string
    explanation_json = Column(Text, nullable=False) # Stored as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    consultation = relationship("Consultation", back_populates="reports")

class MedicalDocument(Base):
    __tablename__ = "medical_documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    publisher = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    version = Column(String, nullable=True)
    publication_date = Column(String, nullable=True)
    category = Column(String, nullable=True)
    filename = Column(String, nullable=True)
    content = Column(Text, nullable=False)

    chunks = relationship("MedicalChunk", back_populates="document", cascade="all, delete-orphan")

class MedicalChunk(Base):
    __tablename__ = "medical_chunks"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("medical_documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    section = Column(String, nullable=True)
    page_number = Column(Integer, nullable=True)
    content = Column(Text, nullable=False)
    embedding_json = Column(Text, nullable=False)

    document = relationship("MedicalDocument", back_populates="chunks")
