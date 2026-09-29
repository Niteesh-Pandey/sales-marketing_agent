import time
from google import genai
from config.settings import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_FALLBACK_MODEL

class GeminiClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or GEMINI_API_KEY
        if not self.api_key:
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)

    def is_configured(self) -> bool:
        return bool(self.client)

    def generate_text(
        self,
        prompt: str,
        system_instruction: str = None,
        model: str = None,
        json_mode: bool = False
    ) -> str:
        if not self.client:
            raise ValueError("Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.")

        preferred_model = model or GEMINI_MODEL
        models_to_try = [preferred_model, GEMINI_FALLBACK_MODEL]

        last_error = None
        for current_model in models_to_try:
            for attempt in range(1, 3):
                try:
                    config = {}
                    if system_instruction:
                        config["system_instruction"] = system_instruction
                    if json_mode:
                        config["response_mime_type"] = "application/json"

                    response = self.client.models.generate_content(
                        model=current_model,
                        contents=prompt,
                        config=config
                    )
                    if response and response.text:
                        return response.text
                except Exception as e:
                    last_error = e
                    # Exponential backoff on rate-limit or network hiccup
                    time.sleep(1.0 * attempt)

        raise RuntimeError(f"Gemini API request failed after retries: {last_error}")

# Shared global instance
gemini_service = GeminiClient()
