from typing import Dict, Any, Callable
from database.db import SessionLocal
from database.models import LeadModel, CampaignModel, TaskModel, AuditLogModel
from datetime import datetime

class ToolRouter:
    """Safe, explicit tool dispatcher for the agent. Never permits arbitrary code execution."""

    @staticmethod
    def get_leads(limit: int = 10, min_score: int = 0):
        db = SessionLocal()
        try:
            leads = db.query(LeadModel).filter(LeadModel.lead_score >= min_score).order_by(LeadModel.lead_score.desc()).limit(limit).all()
            return [
                {
                    "lead_id": l.lead_id,
                    "name": l.name,
                    "company": l.company,
                    "city": l.city,
                    "budget": l.budget,
                    "score": l.lead_score,
                    "stage": l.stage,
                    "notes": l.notes
                }
                for l in leads
            ]
        finally:
            db.close()

    @staticmethod
    def get_pipeline_summary():
        db = SessionLocal()
        try:
            leads = db.query(LeadModel).all()
            summary = {}
            for l in leads:
                summary[l.stage] = summary.get(l.stage, 0) + 1
            return summary
        finally:
            db.close()

    @staticmethod
    def get_campaign_metrics():
        db = SessionLocal()
        try:
            campaigns = db.query(CampaignModel).all()
            return [
                {
                    "name": c.name,
                    "channel": c.channel,
                    "spend": c.spend,
                    "revenue": c.revenue,
                    "leads": c.leads,
                    "qualified": c.qualified_leads,
                    "roas": round(c.revenue / c.spend, 2) if c.spend > 0 else 0
                }
                for c in campaigns
            ]
        finally:
            db.close()

    @staticmethod
    def create_task(title: str, description: str, priority: str = "HIGH", due_date: str = None):
        db = SessionLocal()
        try:
            tid = f"TSK-{int(datetime.utcnow().timestamp())}"
            task = TaskModel(
                task_id=tid,
                title=title,
                description=description,
                priority=priority,
                status="TODO",
                due_date=due_date or datetime.utcnow().strftime("%Y-%m-%d")
            )
            db.add(task)
            db.commit()
            return {"task_id": tid, "status": "CREATED", "title": title}
        finally:
            db.close()
