import torch
from transformers import AutoTokenizer
from transformers import AutoModelForCausalLM

from src.core.config import settings

tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_PATH, trust_remote_code=True)


try:
    model = AutoModelForCausalLM.from_pretrained(
        settings.MODEL_PATH,
        torch_dtype="auto",
        device_map="auto",
        trust_remote_code=True,
    )
    model.eval()
except OSError as e:
    print(f"Warning: Failed to load model due to memory constraints. {e}")
    model = None
