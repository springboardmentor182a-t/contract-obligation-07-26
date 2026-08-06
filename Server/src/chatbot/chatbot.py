import torch
import re


from src.chatbot.model import model, tokenizer

CONTRACT_KEYWORDS = [
    "contract",
    "agreement",
    "clause",
    "payment",
    "termination",
    "renewal",
    "vendor",
    "client",
    "party",
    "obligation",
    "expiry",
    "effective date",
    "confidentiality",
]


def ask_with_contract(question, context):

    if model is None:
        return "AI model is not available."

    messages = [
        {
            "role": "system",
            "content": (
                "You are ContractIQ AI. "
                "Answer ONLY using the provided contract context. "
                "If the answer is not available, say "
                "Do NOT think step by step.\n"
                "Do NOT reveal reasoning.\n"
                "Respond with only the final answer."
                "'I couldn't find this information in the contract.'"
            ),
        },
        {
            "role": "user",
            "content": f"""
            Contract Context:
            {context}

            Question:
            {question}
            """,
        },
    ]

    text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    inputs = tokenizer(text, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=32,
            do_sample=False,
            temperature=0.0,
            repetition_penalty=1.2,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id,
        )

    generated = outputs[0][inputs["input_ids"].shape[1] :]

    answer = tokenizer.decode(generated, skip_special_tokens=True)

    if "<think>" in answer:
        answer = (
            answer.split("</think>")[-1].strip()
            if "</think>" in answer
            else answer.split("<think>")[-1]
        )

    lines = [line.strip() for line in answer.splitlines() if line.strip()]
    answer = lines[-1]

    return answer


def is_contract_question(question: str):
    q = question.lower()
    return any(keyword in q for keyword in CONTRACT_KEYWORDS)


def general_chat(question: str):

    messages = [
        {
            "role": "system",
            "content": (
                "You are ContractIQ AI, a friendly and professional AI assistant. "
                "Answer directly.\n"
                "Never think aloud.\n"
                "Never explain your reasoning.\n"
                "Output only the final response."
                "You can have normal conversations and also help with contract-related questions. "
                "If the user asks a general question, answer naturally."
            ),
        },
        {"role": "user", "content": question},
    ]

    text = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    inputs = tokenizer(text, return_tensors="pt").to(model.device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=32,
            do_sample=False,
            temperature=0.0,
            repetition_penalty=1.2,
            eos_token_id=tokenizer.eos_token_id,
            pad_token_id=tokenizer.eos_token_id,
        )

    generated = outputs[0][inputs["input_ids"].shape[1] :]

    answer = tokenizer.decode(generated, skip_special_tokens=True).strip()
    # if "<think>" in answer:
    #     answer = (
    #         answer.split("</think>")[-1].strip()
    #         if "</think>" in answer
    #         else answer.split("<think>")[-1]
    #     )

    # lines = [line.strip() for line in answer.splitlines() if line.strip()]
    # answer = lines[-1]
    answer = re.sub(r"<think>.*?</think>", "", answer, flags=re.DOTALL)
    return answer
