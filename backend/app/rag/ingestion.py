import os
import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import MedicalDocument, MedicalChunk
from app.rag.chunker import chunk_medical_text
from app.rag.embeddings import generate_medical_embedding
from app.rag.pdf_parser import parse_document_file

def ingest_medical_document_file(
    db: Session,
    file_path: str,
    title: str,
    publisher: str,
    source_url: str,
    category: str = "General Medicine",
    publication_date: str = "2026",
    version: Optional[str] = "N/A"
) -> MedicalDocument:
    """
    Ingests an actual medical document file (PDF / text document):
    1. Parses document page-by-page preserving page numbers and sections.
    2. Creates MedicalDocument DB record with official metadata.
    3. Chunks pages while retaining exact page_number and section.
    4. Computes 384-dim embeddings for extracted text chunks.
    5. Saves MedicalChunk DB records.
    """
    filename = os.path.basename(file_path)
    pages_data = parse_document_file(file_path)
    
    # Concatenate total document text for master content field
    full_text = "\n\n".join(p["text"] for p in pages_data if p["text"])
    
    doc = MedicalDocument(
        title=title,
        publisher=publisher,
        source_url=source_url,
        version=version or "N/A",
        publication_date=publication_date,
        category=category,
        filename=filename,
        content=full_text
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    chunk_counter = 0
    for page in pages_data:
        page_num = page["page_number"]
        section = page["section"]
        page_text = page["text"]
        
        if not page_text.strip():
            continue
            
        page_chunks = chunk_medical_text(page_text)
        for chunk_text in page_chunks:
            embedding = generate_medical_embedding(chunk_text)
            chunk_obj = MedicalChunk(
                document_id=doc.id,
                chunk_index=chunk_counter,
                section=section,
                page_number=page_num,
                content=chunk_text,
                embedding_json=json.dumps(embedding)
            )
            db.add(chunk_obj)
            chunk_counter += 1
            
    db.commit()
    return doc

def ingest_medical_document(
    db: Session,
    title: str,
    publisher: str,
    content: str,
    source_url: str = "",
    version: str = "N/A",
    category: str = "General Medicine",
    publication_date: str = "2026"
) -> MedicalDocument:
    """
    Fallback direct raw text ingestion.
    """
    doc = MedicalDocument(
        title=title,
        publisher=publisher,
        source_url=source_url,
        version=version,
        publication_date=publication_date,
        category=category,
        filename="manual_input.txt",
        content=content
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    chunks = chunk_medical_text(content)
    for idx, chunk_text in enumerate(chunks):
        embedding = generate_medical_embedding(chunk_text)
        chunk_obj = MedicalChunk(
            document_id=doc.id,
            chunk_index=idx,
            section="N/A",
            page_number=1,
            content=chunk_text,
            embedding_json=json.dumps(embedding)
        )
        db.add(chunk_obj)
        
    db.commit()
    return doc
