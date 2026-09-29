from config.settings import GEMINI_MODEL, GEMINI_FALLBACK_MODEL

class ModelRouter:
    @staticmethod
    def get_model_for_task(task_type: str) -> str:
        # Complex reasoning, analysis, and strategy go to primary model
        if task_type in ["reasoning", "analytics", "strategy", "management_report", "objection_playbook"]:
            return GEMINI_MODEL
        # Fast, low-latency summarization and simple copy drafting
        return GEMINI_FALLBACK_MODEL
