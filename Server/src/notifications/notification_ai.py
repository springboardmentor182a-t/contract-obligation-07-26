import json
import re
import torch
from src.chatbot.model import model, tokenizer

class NotificationPriorityEngine:
    @staticmethod
    def calculate(notification: dict) -> dict:
        """
        Uses Qwen to classify notification priority.
        Returns:
        {
            "priority": "...",
            "score": ...,
            "reason": "..."
        }
        """

        if model is None:
            return {
                "priority": "Low",
                "score": 30,
                "reason": "AI model unavailable."
            }

        title = notification.get("title", "")
        message = notification.get("message", "")

        messages = [
            {
                "role": "system",
                "content": (
                    "You are an AI notification prioritization assistant.\n"
                    "Analyze the notification and assign one priority:\n\n"
                    "Critical\n"
                    "High\n"
                    "Medium\n"
                    "Low\n\n"
                    "Rules:\n"
                    "- Critical: expired contracts, overdue obligations, legal violations, immediate action.\n"
                    "- High: expiring within days, important renewals.\n"
                    "- Medium: assignments, approvals pending, upcoming events.\n"
                    "- Low: informational updates.\n\n"
                    "Return ONLY valid JSON.\n\n"
                    "Example:\n"
                    '{"priority":"Critical","score":95,"reason":"Contract expires tomorrow."}'
                ),
            },
            {
                "role": "user",
                "content": f"""
                Title:
                {title}

                Message:
                {message}
                """
            },
        ]

        prompt = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )

        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=80,
                do_sample=False,
                temperature=0.0,
                repetition_penalty=1.1,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=tokenizer.eos_token_id,
            )

        generated = outputs[0][inputs["input_ids"].shape[1]:]
        answer = tokenizer.decode(generated, skip_special_tokens=True).strip()

        answer = re.sub(r"<think>.*?</think>", "", answer, flags=re.DOTALL).strip()

        try:
            result = json.loads(answer)
            return {
                "priority": result.get("priority", "Low"),
                "score": int(result.get("score", 30)),
                "reason": result.get("reason", "")
            }
        except Exception:
            return {
                "priority": "Low",
                "score": 30,
                "reason": "Unable to classify notification."
            }