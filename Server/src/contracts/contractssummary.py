import re
import torch
import fitz

from src.chatbot.model import model, tokenizer


def extract_pdf_text(file_path: str) -> str:
    """Extract text from uploaded PDF."""

    try:
        document = fitz.open(file_path)

        pages = []

        for page in document:
            text = page.get_text("text")

            if text:
                pages.append(text)

        document.close()

        return "\n".join(pages).strip()

    except Exception as e:
        raise RuntimeError(f"Failed to read PDF: {str(e)}")


def build_contract_context(contract, pdf_text: str) -> str:
    """
    Combine database contract information
    and PDF contract content.
    """

    database_data = f"""
DATABASE CONTRACT INFORMATION

Contract ID: {contract.contract_id}
Title: {contract.title}
Vendor: {contract.vendor}
Contract Type: {contract.type}
Contract Value: {contract.value}
Owner: {contract.owner}
Status: {contract.status}
Compliance: {contract.compliance}
Archived: {contract.archived}

Effective Date: {contract.effective_date}
End Date: {contract.end_date}
Expiry Date: {contract.expiry_date}
Approved Date: {contract.approved_date}
Review Date: {contract.review_date}
"""

    pdf_data = f"""
UPLOADED CONTRACT DOCUMENT

{pdf_text}
"""

    return database_data + "\n" + pdf_data


def summarize_contract(contract) -> str:
    """
    Generate contract summary using:
    1. Database contract data
    2. Uploaded PDF content

    Summary is returned only.
    It is NOT stored in database.
    """

    if model is None:
        return "AI model is not available."

    # ---------------------------------------
    # 1. Check PDF
    # ---------------------------------------

    if not contract.file_path:
        return "No contract PDF is uploaded."

    # ---------------------------------------
    # 2. Read PDF
    # ---------------------------------------

    pdf_text = extract_pdf_text(contract.file_path)

    if not pdf_text:
        return "No readable text found in the contract PDF."

    # ---------------------------------------
    # 3. Combine DB + PDF data
    # ---------------------------------------

    context = build_contract_context(
        contract,
        pdf_text
    )

    # Prevent extremely large input
    context = context[:20000]

    # ---------------------------------------
    # 4. Prompt
    # ---------------------------------------

    messages = [
        {
            "role": "system",
            "content": (
                "You are ContractIQ AI, a professional "
                "contract analysis assistant. "

                "Analyze BOTH the database contract information "
                "and the uploaded contract document. "

                "Use only the information provided. "
                "Do not invent missing information. "

                "If database information and PDF information "
                "conflict, clearly mention the conflict. "

                "Do not reveal reasoning or thinking. "
                "Return only the final contract summary."
            ),
        },
        {
            "role": "user",
            "content": f"""
Analyze the following contract information.

{context}

Create a concise and professional contract summary.

Include information when available:

- Contract overview
- Parties involved
- Contract purpose
- Contract type
- Contract value
- Payment terms
- Effective date
- Expiry/end date
- Renewal terms
- Key obligations
- Termination conditions
- Confidentiality requirements
- Compliance requirements
- Important risks or penalties
- Contract owner
- Current status

IMPORTANT:

1. Use BOTH database data and PDF content.
2. Do not invent information.
3. If something is missing, don't assume it.
4. If PDF and database data conflict, mention the conflict.
5. Keep the final summary concise.
""",
        },
    ]

    # ---------------------------------------
    # 5. Tokenize
    # ---------------------------------------

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    inputs = tokenizer(
        text,
        return_tensors="pt"
    ).to(model.device)

    # ---------------------------------------
    # 6. Generate
    # ---------------------------------------

    with torch.no_grad():

        outputs = model.generate(
            **inputs,
            max_new_tokens=128,
            do_sample=False,
            repetition_penalty=1.1,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id,
        )

    # ---------------------------------------
    # 7. Get only generated text
    # ---------------------------------------

    generated = outputs[0][
        inputs["input_ids"].shape[1]:
    ]

    answer = tokenizer.decode(
        generated,
        skip_special_tokens=True
    ).strip()

    # ---------------------------------------
    # 8. Remove thinking
    # ---------------------------------------

    answer = re.sub(
        r"<think>.*?</think>",
        "",
        answer,
        flags=re.DOTALL
    ).strip()

    return answer