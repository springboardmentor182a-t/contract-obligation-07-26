import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

from src.core.config import settings

tokenizer = AutoTokenizer.from_pretrained(settings.MODEL_PATH, trust_remote_code=True)

device = "cuda" if torch.cuda.is_available() else "cpu"

try:
    if device == "cuda":
        model = AutoModelForCausalLM.from_pretrained(
            settings.MODEL_PATH,
            torch_dtype=torch.float16,
            device_map="auto",  # Automatically place model on GPU
            trust_remote_code=True,
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            settings.MODEL_PATH,
            torch_dtype=torch.float32,
            trust_remote_code=True,
        )
        model.to(device)

    model.eval()

except OSError as e:
    print(f"Warning: Failed to load model. {e}")
    model = None
