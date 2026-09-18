import os
import re
from typing import List, Dict, Any
import pypdf

METADATA_REGISTRY = {
    "WHO_malaria_2026.pdf": {
        "title": "WHO Guidelines for Malaria (2026 Edition)",
        "publisher": "World Health Organization",
        "source_url": "https://www.who.int/publications/i/item/9789240098795",
        "version": "2026 Edition"
    },
    "WHO_TB_treatment_2025.pdf": {
        "title": "WHO Consolidated Guidelines on Tuberculosis — Module 4: Treatment and Care",
        "publisher": "World Health Organization",
        "source_url": "https://www.who.int/publications/i/item/9789240107243",
        "version": "2025 Module 4"
    },
    "WHO_TB_comorbidities_2025.pdf": {
        "title": "WHO Consolidated Guidelines on Tuberculosis — Module 6: Comorbidities (Second Edition)",
        "publisher": "World Health Organization",
        "source_url": "https://www.who.int/publications/i/item/9789240111967",
        "version": "Second Edition 2025"
    },
    "WHO_PEN_NCD_Primary_Care.pdf": {
        "title": "WHO Package of Essential Noncommunicable Disease Interventions (PEN) for Primary Health Care",
        "publisher": "World Health Organization",
        "source_url": "https://www.who.int/publications/i/item/9789240009226",
        "version": "PEN Guidelines"
    },
    "WHO_NCD_Low_Resource_Settings.pdf": {
        "title": "WHO Prevention & Control of NCDs: Primary Health Care in Low-Resource Settings",
        "publisher": "World Health Organization",
        "source_url": "https://www.who.int/publications/i/item/9789241548397",
        "version": "Low-Resource Edition"
    },
    "ADA_standards_2026_Sec1.pdf": {
        "title": "ADA Standards of Care in Diabetes — 2026: Section 1. Improving Care and Population Health",
        "publisher": "American Diabetes Association",
        "source_url": "https://diabetesjournals.org/care/issue/49/Supplement_1",
        "version": "2026 Standards of Care"
    },
    "ADA_standards_2026_Sec2.pdf": {
        "title": "ADA Standards of Care in Diabetes — 2026: Section 2. Diagnosis and Classification of Diabetes",
        "publisher": "American Diabetes Association",
        "source_url": "https://diabetesjournals.org/care/issue/49/Supplement_1",
        "version": "2026 Standards of Care"
    },
    "ADA_standards_2026_Revisions.pdf": {
        "title": "ADA Standards of Care in Diabetes — 2026: Summary of Revisions",
        "publisher": "American Diabetes Association",
        "source_url": "https://diabetesjournals.org/care/issue/49/Supplement_1",
        "version": "2026 Standards of Care"
    }
}

def extract_file_metadata(file_path: str) -> Dict[str, str]:
    """
    Returns verified metadata dictionary (title, publisher, source_url, version) for a file.
    """
    filename = os.path.basename(file_path)
    if filename in METADATA_REGISTRY:
        return METADATA_REGISTRY[filename]
        
    # Generic fallback based on filename format
    clean_title = os.path.splitext(filename)[0].replace("_", " ")
    publisher = "World Health Organization" if "WHO" in clean_title else "Clinical Guidelines"
    
    return {
        "title": clean_title,
        "publisher": publisher,
        "source_url": "",
        "version": "N/A"
    }

def parse_document_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Parses a PDF or text document file, returning a list of page data dictionaries:
    [
        {
            "page_number": 1,
            "text": "...",
            "section": "Section 1: Clinical Triage"
        },
        ...
    ]
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Document file not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        return _parse_pdf(file_path)
    else:
        return _parse_text_file(file_path)

def _parse_pdf(file_path: str) -> List[Dict[str, Any]]:
    pages_data = []
    reader = pypdf.PdfReader(file_path)
    current_section = "N/A"
    
    for idx, page in enumerate(reader.pages):
        page_num = idx + 1
        text = page.extract_text() or ""
        
        section = _extract_section_heading(text) or current_section
        if section != "N/A":
            current_section = section
            
        pages_data.append({
            "page_number": page_num,
            "text": text.strip(),
            "section": current_section
        })
        
    return pages_data

def _parse_text_file(file_path: str) -> List[Dict[str, Any]]:
    pages_data = []
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        
    page_splits = re.split(r'===\s*PAGE\s*(\d+)\s*===', content)
    
    if len(page_splits) > 1:
        current_section = "N/A"
        i = 1
        while i < len(page_splits):
            page_num = int(page_splits[i])
            page_text = page_splits[i + 1].strip() if i + 1 < len(page_splits) else ""
            
            section = _extract_section_heading(page_text) or current_section
            if section != "N/A":
                current_section = section
                
            pages_data.append({
                "page_number": page_num,
                "text": page_text,
                "section": current_section
            })
            i += 2
    else:
        section = _extract_section_heading(content) or "N/A"
        pages_data.append({
            "page_number": 1,
            "text": content.strip(),
            "section": section
        })
        
    return pages_data

def _extract_section_heading(text: str) -> str:
    lines = text.split("\n")
    for line in lines[:12]:
        line_str = line.strip()
        if not line_str:
            continue
            
        match = re.search(r'^(Section\s+\d+[:\.\s].*?|Chapter\s+\d+[:\.\s].*?|\d+\.\s+[A-Z].*?|Module\s+\d+[:\.\s].*?)', line_str, re.IGNORECASE)
        if match:
            return match.group(0).strip()
            
        if line_str.startswith("#"):
            return line_str.lstrip("#").strip()
            
    return "N/A"
