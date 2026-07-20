from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import SessionLocal
from src.documents.models import DocumentCreate
from src.documents.service import (
    get_documents,
    create_document,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def fetch_documents(db: Session = Depends(get_db)):
    return get_documents(db)


@router.post("/")
def add_document(
    data: DocumentCreate,
    db: Session = Depends(get_db),
):
    return create_document(db, data)