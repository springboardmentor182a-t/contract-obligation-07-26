import os
import torch
from transformers import AutoTokenizer
from transformers import AutoModelForCausalLM

from src.core.config import settings

# Check if we want to bypass loading to save RAM (e.g. t2.micro environment)
if os.environ.get("DISABLE_CHATBOT_MODEL", "false").lower() == "true":
    print("Chatbot model is disabled by environment variable to save RAM.")
    model = None
    tokenizer = None
else:
    try:
        tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_PATH, trust_remote_code=True)
        model = AutoModelForCausalLM.from_pretrained(
            settings.MODEL_PATH,
            torch_dtype="auto",
            device_map="auto",
            trust_remote_code=True,
        )
        model.eval()
    except Exception as e:
        print(f"Warning: Failed to load model due to memory constraints or error. {e}")
        model = None
        tokenizer = None

