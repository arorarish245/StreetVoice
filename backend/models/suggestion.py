import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
MODEL_NAME = "gemini-1.5-flash-001"

def get_suggestion(tag: str, location: str, description: str) -> str:
    prompt = (
        "You are an expert city maintenance assistant helping municipal admins solve public infrastructure issues efficiently.\n\n"
        "Based on the following citizen report, provide a practical step-by-step solution plan to resolve the issue. Include:\n"
        "1. Recommended actions.\n"
        "2. Which department or authority should be contacted.\n"
        "3. Estimated time for resolution.\n"
        "4. Any preventive measures for the future.\n\n"
        f"Report Details:\n"
        f"Category (Tag): {tag}\n"
        f"Location: {location}\n"
        f"Description: {description}\n\n"
        "Please give a  short , concise and actionable suggestion in 200 words"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        candidates = response.json().get("candidates", [])
        if candidates:
            return candidates[0].get("content", {}).get("parts", [{"text": ""}])[0].get("text", "")
        else:
            return "No suggestion returned by the model."
    else:
        return f"Error {response.status_code}: {response.text}"
