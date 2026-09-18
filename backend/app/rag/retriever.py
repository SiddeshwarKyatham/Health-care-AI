import json
import numpy as np
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.database.models import MedicalChunk, MedicalDocument
from app.rag.embeddings import generate_medical_embedding

_CACHED_CHUNKS_DATA = None
_CACHED_MATRIX = None

DOMAIN_KEYWORDS_MAP = {
    "respiratory": ["pneumonia", "sari", "dyspnea", "copd", "asthma", "oxygen", "hypoxemia", "ards", "influenza", "respiratory"],
    "diabetes": ["diabetes", "dka", "ketoacidosis", "glucose", "insulin", "hypoglycemia", "hba1c", "metformin", "sglt2", "glp-1", "gdm"],
    "cardiology": ["heart failure", "hfref", "hypertension", "hypertensive", "acs", "coronary", "troponin", "statin", "atrial fibrillation", "cardiovascular", "pen"],
    "tuberculosis": ["tuberculosis", "tb", "rifampicin", "isoniazid", "mdr-tb", "bpaL", "tpt", "xpert"],
    "vector borne": ["malaria", "falciparum", "artemisinin", "act", "artesunate", "llin", "irs", "mosquito"],
    "infectious emergency": ["meningitis", "sepsis", "septic", "ceftriaxone", "vancomycin", "dexamethasone", "lactate"]
}

def load_vector_cache(db: Session, force_reload: bool = False):
    global _CACHED_CHUNKS_DATA, _CACHED_MATRIX
    if _CACHED_MATRIX is not None and not force_reload:
        return

    chunks = db.query(MedicalChunk).join(MedicalDocument).all()
    cached_data = []
    vectors = []
    for chunk in chunks:
        vec = json.loads(chunk.embedding_json)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = [v / norm for v in vec]
        vectors.append(vec)
        cached_data.append({
            "chunk_id": chunk.id,
            "document_id": chunk.document_id,
            "title": chunk.document.title,
            "publisher": chunk.document.publisher or "N/A",
            "source_url": chunk.document.source_url or "",
            "version": chunk.document.version or "N/A",
            "publication_date": chunk.document.publication_date or "",
            "category": chunk.document.category or "General Medicine",
            "filename": chunk.document.filename or "",
            "section": chunk.section or "N/A",
            "page_number": chunk.page_number or 1,
            "content": chunk.content
        })
    _CACHED_CHUNKS_DATA = cached_data
    _CACHED_MATRIX = np.array(vectors, dtype=np.float32)

def retrieve_relevant_medical_chunks(
    db: Session,
    query_text: str,
    top_k: int = 5,
    min_score: float = 0.05
) -> List[Dict[str, Any]]:
    """
    Performs vector similarity search against medical_chunks table.
    Uses NumPy matrix operations + Domain Semantic Boosting to retrieve top relevant medical evidence chunks.
    """
    global _CACHED_CHUNKS_DATA, _CACHED_MATRIX
    if _CACHED_MATRIX is None or _CACHED_CHUNKS_DATA is None or len(_CACHED_CHUNKS_DATA) == 0:
        load_vector_cache(db)
        
    query_vector = np.array(generate_medical_embedding(query_text), dtype=np.float32)
    q_norm = np.linalg.norm(query_vector)
    if q_norm > 0:
        query_vector /= q_norm
        
    # Tokenize query terms for lexical matching
    import re
    q_tokens = set(w.lower() for w in re.findall(r'\b[a-zA-Z0-9]{3,}\b', query_text))

    # Dot-product similarity across all 8,959 vectors
    raw_scores = np.dot(_CACHED_MATRIX, query_vector)
    
    query_lower = query_text.lower()
    final_scores = np.copy(raw_scores)
    
    # Calculate domain boost & lexical keyword overlap boost per chunk
    for i, item in enumerate(_CACHED_CHUNKS_DATA):
        chunk_cat = item["category"].lower()
        
        # Check matching domain for query
        for domain, keywords in DOMAIN_KEYWORDS_MAP.items():
            if any(qkw in query_lower for qkw in keywords):
                if domain in chunk_cat:
                    final_scores[i] += 0.35 # Semantic domain alignment boost
                    break

        # Lexical term match boost (hybrid RAG retrieval)
        content_lower = item["content"].lower()
        c_tokens = set(w for w in re.findall(r'\b[a-zA-Z0-9]{3,}\b', content_lower))
        matches = len(q_tokens.intersection(c_tokens))
        if matches > 0:
            final_scores[i] += matches * 0.10 # Hybrid lexical match boost


    top_indices = np.argsort(final_scores)[::-1][:top_k * 4]
    
    scored_results = []
    for idx in top_indices:
        score = float(final_scores[idx])
        if score >= min_score:
            item = dict(_CACHED_CHUNKS_DATA[idx])
            item["score"] = round(score, 4)
            scored_results.append(item)
            if len(scored_results) >= top_k:
                break
                
    return scored_results


