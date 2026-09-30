"""
AI Sales & Marketing Copilot Agent (Google GenAI Python SDK)
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

import os
from typing import Dict, Any, List, Optional

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    types = None
    GENAI_AVAILABLE = False

from .scoring import calculate_lead_score
from .analytics import compute_campaign_metrics
from .objection_playbook import resolve_objection

DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-3.1-flash-lite")


class NiteeshAIAgent:
    """Enterprise AI Sales & Marketing Agent."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model = DEFAULT_MODEL
        if GENAI_AVAILABLE and self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def ask(self, query: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> str:
        """Executes evidence-grounded agent query with fallback."""
        if not GENAI_AVAILABLE:
            return (
                "ℹ️ google-genai Python SDK is not installed in the current environment. "
                "Run 'pip install google-genai' to use the direct Python SDK, or open the "
                "included Node.js Web Command Center ('npm run dev') which is already running full-stack."
            )

        if not self.client:
            return (
                "⚠️ GEMINI_API_KEY is not configured in the environment. "
                "Please set GEMINI_API_KEY in your .env file or hosting provider."
            )

        system_instruction = (
            "You are the Niteesh AI Sales & Marketing Executive Agent for Niteesh AI Growth Labs "
            "and UrbanNest Properties (Mumbai, Thane, Pune). "
            "Founder: Niteesh Pandey. "
            "Strictly follow the sequence: DATA -> CONTEXT -> ANALYSIS -> REASONING -> RECOMMENDATION. "
            "Distinguish FACT, INFERENCE, and ASSUMPTION. Do not hallucinate prices or inventory. "
            "Keep all advice evidence-grounded and consultative."
        )

        models_to_try = [self.model, FALLBACK_MODEL, "gemini-2.5-flash"]
        last_error = None

        for m in models_to_try:
            try:
                response = self.client.models.generate_content(
                    model=m,
                    contents=query,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.2
                    )
                )
                if response.text:
                    return response.text
            except Exception as e:
                last_error = e
                continue

        return f"Error executing AI query: {last_error}"

    def score_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates deterministic score and returns AI strategic recommendation."""
        score, breakdown = calculate_lead_score(lead_data)
        return {
            "lead_id": lead_data.get("lead_id"),
            "score": score,
            "breakdown": breakdown,
            "recommended_action": "MEETING" if score >= 80 else "WHATSAPP_DRAFT" if score >= 60 else "NURTURE"
        }
