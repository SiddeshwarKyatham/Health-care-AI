import json
import math
import re
from typing import List

_model_instance = None

def get_transformer_model():
    """
    Lazy loader for SentenceTransformer model ('all-MiniLM-L6-v2').
    """
    global _model_instance
    if _model_instance is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model_instance = SentenceTransformer("all-MiniLM-L6-v2")
            print("Successfully loaded pretrained SentenceTransformer model ('all-MiniLM-L6-v2').")
        except Exception as e:
            print(f"Warning: SentenceTransformer model load failed ({e}). Using clinical fallback encoder.")
            _model_instance = False
    return _model_instance

CLINICAL_KEYWORDS = [
    "fever", "cough", "dyspnea", "breathing", "respiratory", "pneumonia", "influenza",
    "covid", "hypertension", "blood pressure", "chest pain", "angina", "myocardial", "infarction",
    "diabetes", "glucose", "insulin", "ketoacidosis", "sepsis", "infection", "antibiotics",
    "antiviral", "corticosteroid", "tachycardia", "hypoxia", "saturation", "spo2", "wheezing",
    "crackles", "troponin", "ecg", "creatinine", "leukocytosis", "wbc", "guideline", "protocol",
    "who", "pubmed", "acc", "aha", "ada", "treatment", "diagnosis", "contraindication", "dosage"
]

def generate_medical_embedding(text: str, vector_dim: int = 384) -> List[float]:
    """
    Generates a 384-dimensional dense vector embedding.
    Uses pretrained SentenceTransformer ('all-MiniLM-L6-v2') if available,
    with clinical key-term weighted dense encoding fallback.
    """
    if not text or not text.strip():
        return [0.0] * vector_dim

    model = get_transformer_model()
    if model:
        try:
            vec = model.encode(text, normalize_embeddings=True)
            return [float(x) for x in vec]
        except Exception as e:
            print(f"Transformer encode error ({e}), running fallback.")

    return _fallback_clinical_embedding(text, vector_dim)

def _fallback_clinical_embedding(text: str, vector_dim: int = 384) -> List[float]:
    text_clean = text.lower()
    words = re.findall(r'\b\w+\b', text_clean)
    vec = [0.0] * vector_dim
    if not words:
        return vec

    for word in words:
        h = 0
        for char in word:
            h = (h * 31 + ord(char)) % vector_dim
        vec[h] += 1.0

    for term in CLINICAL_KEYWORDS:
        if term in text_clean:
            term_hash = sum(ord(c) for c in term) * 17 % vector_dim
            vec[term_hash] += 5.0

    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [v / norm for v in vec]

    return vec

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)
