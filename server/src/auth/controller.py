from fastapi import APIRouter  # type: ignore[import]

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/health")
def health():
    return {"status": "ok"}
