from sqlalchemy.orm import Session

from src.entities.document import Document
from src.documents.models import DocumentCreate


def get_documents(db: Session):
    return db.query(Document).all()


def create_document(db: Session, data: DocumentCreate):
    document = Document(
        file_name=data.file_name,
        file_path=data.file_path,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "success": True,
        "message": "Document uploaded successfully",
        "document": document,
    }