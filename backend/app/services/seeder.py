import os
from sqlalchemy.orm import Session
from app.database.models import MedicalDocument, User
from app.rag.ingestion import ingest_medical_document_file
from app.rag.pdf_parser import extract_file_metadata

def seed_knowledge_base_if_empty(db: Session):
    existing_docs = db.query(MedicalDocument).count()
    if existing_docs == 0:
        print("Seeding multi-domain official guideline documents from backend/data/medical_guidelines/...")
        base_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "medical_guidelines")
        
        if not os.path.exists(base_dir):
            print(f"Warning: Base guidelines directory not found at {base_dir}")
            return

        ingested_count = 0
        # Walk recursively through all domain subdirectories (respiratory, diabetes, cardiology, etc.)
        for root, dirs, files in os.walk(base_dir):
            rel_folder = os.path.relpath(root, base_dir)
            category = rel_folder.replace("_", " ").title() if rel_folder != "." else "General Medicine"

            for filename in files:
                if filename.startswith(".") or filename.endswith(".pyc"):
                    continue
                    
                file_path = os.path.join(root, filename)
                meta = extract_file_metadata(file_path)
                
                print(f"Ingesting [{category}] document: {filename}...")
                ingest_medical_document_file(
                    db=db,
                    file_path=file_path,
                    title=meta["title"],
                    publisher=meta["publisher"],
                    source_url=meta["source_url"],
                    category=category,
                    publication_date="2026",
                    version=meta["version"]
                )
                ingested_count += 1
                
        print(f"Successfully seeded {ingested_count} official medical guideline documents across domain subdirectories.")

    # Seed demo doctor user if absent
    existing_user = db.query(User).filter(User.email == "pavan@hospital.org").first()
    if not existing_user:
        from app.api.auth import hash_password
        doc_user = User(
            name="Dr. Pavan",
            email="pavan@hospital.org",
            password_hash=hash_password("demo123"),
            role="Rural Health Specialist"
        )
        db.add(doc_user)
        db.commit()
