from fastapi import FastAPI
from fastapi import UploadFile, APIRouter
from fastapi import File
import shutil


from src.chatbot.pdf_reader import extract_text
from src.chatbot.chunking import chunk_text
from src.chatbot.vector_store import save_chunks
from src.chatbot.chatbot import ask_with_contract, is_contract_question, general_chat
from src.chatbot.rag import retrieve

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"],
)


@router.post("/upload")
async def upload(file: UploadFile = File(...)):

    path = f"uploads/{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(path)
    chunks = chunk_text(text)
    save_chunks(chunks)

    return {"message": "Contract Uploaded"}


@router.get("/chat")
def chat(question: str):
    if is_contract_question(question):
        context = retrieve(question)

        if context.strip():
            return {"answer": ask_with_contract(question, context)}

    return {"answer": general_chat(question)}
