import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from server/.env"
    )

client = genai.Client(api_key=api_key)

print("\nModels that support generateContent:\n")

for model in client.models.list():
    supported_actions = model.supported_actions or []

    if "generateContent" in supported_actions:
        print(model.name)