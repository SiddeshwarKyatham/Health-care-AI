import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import MedicalDocument, MedicalChunk
from app.rag.ingestion import ingest_medical_document, ingest_medical_document_file

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge Base"])

class DocumentIngestRequest(BaseModel):
    title: str
    publisher: str
    source_url: Optional[str] = ""
    version: Optional[str] = "N/A"
    category: Optional[str] = "General Medicine"
    publication_date: Optional[str] = "2026"
    content: str

@router.get("/documents")
def list_medical_documents(db: Session = Depends(get_db)):
    docs = db.query(MedicalDocument).all()
    result = []
    for d in docs:
        chunk_count = db.query(MedicalChunk).filter(MedicalChunk.document_id == d.id).count()
        result.append({
            "id": d.id,
            "title": d.title,
            "publisher": d.publisher or "N/A",
            "source_url": d.source_url or "",
            "version": d.version or "N/A",
            "category": d.category or "General Medicine",
            "publication_date": d.publication_date or "",
            "filename": d.filename or "",
            "chunk_count": chunk_count,
            "content_preview": d.content[:200] + "..."
        })
    return result

@router.post("/ingest")
def ingest_document(req: DocumentIngestRequest, db: Session = Depends(get_db)):
    doc = ingest_medical_document(
        db=db,
        title=req.title,
        publisher=req.publisher,
        source_url=req.source_url or "",
        version=req.version or "N/A",
        content=req.content,
        category=req.category or "General Medicine",
        publication_date=req.publication_date or "2026"
    )
    chunk_count = db.query(MedicalChunk).filter(MedicalChunk.document_id == doc.id).count()
    return {
        "message": "Medical document ingested and chunked successfully",
        "document_id": doc.id,
        "title": doc.title,
        "chunks_created": chunk_count
    }

@router.post("/upload")
async def upload_document_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    publisher: str = Form(...),
    source_url: str = Form(""),
    version: str = Form("N/A"),
    category: str = Form("General Medicine"),
    publication_date: str = Form("2026"),
    db: Session = Depends(get_db)
):
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    doc = ingest_medical_document_file(
        db=db,
        file_path=file_path,
        title=title,
        publisher=publisher,
        source_url=source_url,
        category=category,
        publication_date=publication_date,
        version=version
    )
    
    chunk_count = db.query(MedicalChunk).filter(MedicalChunk.document_id == doc.id).count()
    return {
        "message": f"Successfully ingested file {file.filename}",
        "document_id": doc.id,
        "title": doc.title,
        "chunks_created": chunk_count
    }
