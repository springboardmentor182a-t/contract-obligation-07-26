from io import BytesIO
from types import SimpleNamespace

import pytest
from fastapi import HTTPException, UploadFile
from starlette.datastructures import Headers

from src.contract_repository import controller


class FakeResult:
    def __init__(self, value):
        self.value = value

    def scalar_one_or_none(self):
        return self.value


class FakeDatabaseSession:
    def __init__(self, query_result):
        self.query_result = query_result
        self.added = []
        self.deleted = []
        self.commit_count = 0

    def execute(self, statement):
        return FakeResult(self.query_result)

    def add(self, value):
        self.added.append(value)

    def delete(self, value):
        self.deleted.append(value)

    def commit(self):
        self.commit_count += 1

    def refresh(self, value):
        return None


def make_upload(filename="agreement.pdf", content=b"%PDF-1.4 test"):
    return UploadFile(
        file=BytesIO(content),
        filename=filename,
        headers=Headers({"content-type": "application/pdf"}),
    )


def test_upload_document_creates_audit_log(monkeypatch, tmp_path):
    contract = SimpleNamespace(
        id=42,
        contract_name="Master Services Agreement",
    )
    db = FakeDatabaseSession(contract)
    audit_calls = []

    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    response = controller.upload_document(
        contract_id=contract.id,
        file=make_upload(),
        db=db,
    )

    document = response["document"]

    assert response["message"] == "Document uploaded successfully."
    assert document.original_name == "agreement.pdf"
    assert document.contract_id == contract.id
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "CREATE",
        "action": "Contract Document Uploaded",
        "module": "Contract Repository",
        "description": (
            "Uploaded document: agreement.pdf "
            "to contract: Master Services Agreement (ID: 42)"
        ),
    }
    assert (tmp_path / document.file_path).is_file()


def test_delete_document_creates_audit_log(monkeypatch, tmp_path):
    stored_file = tmp_path / "agreement.pdf"
    stored_file.write_bytes(b"%PDF-1.4 test")

    document = SimpleNamespace(
        id=7,
        contract_id=42,
        original_name="agreement.pdf",
        file_path=str(stored_file),
    )
    db = FakeDatabaseSession(document)
    audit_calls = []

    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    response = controller.delete_document(
        document_id=document.id,
        db=db,
    )

    assert response == {"message": "Document deleted successfully"}
    assert not stored_file.exists()
    assert db.deleted == [document]
    assert db.commit_count == 1
    assert len(audit_calls) == 1
    assert audit_calls[0] == {
        "db": db,
        "user_id": None,
        "event_type": "DELETE",
        "action": "Contract Document Deleted",
        "module": "Contract Repository",
        "description": (
            "Deleted document: agreement.pdf from contract ID: 42"
        ),
    }


def test_upload_document_does_not_log_when_contract_is_missing(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = []

    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    with pytest.raises(HTTPException) as error:
        controller.upload_document(
            contract_id=999,
            file=make_upload(),
            db=db,
        )

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []


def test_upload_document_does_not_log_invalid_file(monkeypatch):
    contract = SimpleNamespace(id=42, contract_name="Test Contract")
    db = FakeDatabaseSession(contract)
    audit_calls = []

    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    with pytest.raises(HTTPException) as error:
        controller.upload_document(
            contract_id=contract.id,
            file=make_upload(filename="notes.txt", content=b"test"),
            db=db,
        )

    assert error.value.status_code == 400
    assert db.commit_count == 0
    assert audit_calls == []


def test_delete_document_does_not_log_when_document_is_missing(monkeypatch):
    db = FakeDatabaseSession(None)
    audit_calls = []

    monkeypatch.setattr(
        controller,
        "create_audit_log",
        lambda **kwargs: audit_calls.append(kwargs),
    )

    with pytest.raises(HTTPException) as error:
        controller.delete_document(
            document_id=999,
            db=db,
        )

    assert error.value.status_code == 404
    assert db.commit_count == 0
    assert audit_calls == []
