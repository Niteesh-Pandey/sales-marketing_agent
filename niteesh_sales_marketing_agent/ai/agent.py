from pathlib import Path
from ai.gemini_client import gemini_service
from ai.tool_router import ToolRouter
from config.settings import BASE_DIR

class SalesMarketingAgent:
    def __init__(self):
        system_prompt_path = BASE_DIR / "prompts" / "system_prompt.txt"
        if system_prompt_path.exists():
            self.system_prompt = system_prompt_path.read_text(encoding="utf-8")
        else:
            self.system_prompt = "You are Niteesh AI Sales & Marketing Agent supporting Niteesh Pandey."

    def answer_query(self, user_query: str, chat_history: list = None) -> str:
        # Check if tools provide better evidence
        context_snippets = []
        q_lower = user_query.lower()

        if "lead" in q_lower or "contact" in q_lower or "who" in q_lower:
            leads = ToolRouter.get_leads(limit=5, min_score=75)
            context_snippets.append(f"Top Active Priority Leads in Database: {leads}")

        if "pipeline" in q_lower or "funnel" in q_lower or "conversion" in q_lower:
            pipe = ToolRouter.get_pipeline_summary()
            context_snippets.append(f"Current Pipeline Stage Counts: {pipe}")

        if "campaign" in q_lower or "spend" in q_lower or "roas" in q_lower or "marketing" in q_lower:
            camps = ToolRouter.get_campaign_metrics()
            context_snippets.append(f"Marketing Campaign Metrics: {camps}")

        context_str = "\n".join(context_snippets) if context_snippets else "No specific tool context required."

        full_prompt = f"""BUSINESS DATA CONTEXT:
{context_str}

Niteesh Pandey asks:
{user_query}

Response (Follow FACT -> INFERENCE -> ASSUMPTION -> RECOMMENDATION sequence):"""

        return gemini_service.generate_text(
            prompt=full_prompt,
            system_instruction=self.system_prompt,
            model=None
        )

agent_instance = SalesMarketingAgent()
