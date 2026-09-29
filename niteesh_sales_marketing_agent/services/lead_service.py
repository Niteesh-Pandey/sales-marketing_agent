from typing import List, Dict, Optional
from database.db import SessionLocal
from database.models import LeadModel, AuditLogModel
from datetime import datetime

class LeadService:
    @staticmethod
    def calculate_score(budget: float, product: str, city: str, title: str, notes: str, stage: str) -> Dict:
        reasons = []
        budget_fit = 0
        product_fit = 0
        purchase_intent = 0
        engagement_recency = 12
        decision_authority = 0
        timeline_fit = 0
        location_fit = 0

        # 1. Budget Fit
        if "Prime" in product:
            if budget >= 12000000:
                budget_fit = 20
                reasons.append("Budget matches Prime Residences (₹1.2Cr–₹2.5Cr)")
            else:
                budget_fit = 10
        elif "Select" in product:
            if budget >= 7500000:
                budget_fit = 20
                reasons.append("Budget matches Select Homes (₹75L–₹1.35Cr)")
            else:
                budget_fit = 10
        else:
            budget_fit = 15

        # 2. Product Fit
        if product:
            product_fit = 15
            reasons.append(f"Clear interest in {product}")

        # 3. Purchase Intent
        n_low = notes.lower()
        if "immediate" in n_low or "ready" in n_low or "pre-approved" in n_low or "token" in n_low:
            purchase_intent = 15
            reasons.append("High urgency cues in customer notes")
        else:
            purchase_intent = 10

        # 4. Authority
        t_low = title.lower()
        if any(w in t_low for w in ["founder", "director", "cxo", "ceo", "vp", "head"]):
            decision_authority = 15
            reasons.append("Senior decision-maker / Executive role")
        else:
            decision_authority = 10

        # 5. Timeline Fit
        timeline_fit = 8

        # 6. Location Fit
        if city in ["Mumbai", "Thane", "Pune"]:
            location_fit = 10
            reasons.append(f"Primary target market: {city}")

        total_score = min(100, budget_fit + product_fit + purchase_intent + engagement_recency + decision_authority + timeline_fit + location_fit)

        priority = "HIGH" if total_score >= 80 else ("MEDIUM" if total_score >= 60 else "LOW")
        next_action = "CALL" if priority == "HIGH" else "EMAIL"

        return {
            "lead_score": total_score,
            "intent_score": min(100, int((purchase_intent / 15) * 100)),
            "fit_score": min(100, int(((budget_fit + product_fit + location_fit) / 45) * 100)),
            "engagement_score": min(100, int(((engagement_recency + decision_authority) / 30) * 100)),
            "ai_priority": priority,
            "recommended_next_action": next_action,
            "reasons": reasons
        }

    @staticmethod
    def get_all_leads() -> List[Dict]:
        db = SessionLocal()
        try:
            leads = db.query(LeadModel).order_by(LeadModel.lead_score.desc()).all()
            return [
                {
                    "lead_id": l.lead_id,
                    "name": l.name,
                    "email": l.email,
                    "phone": l.phone,
                    "company": l.company,
                    "city": l.city,
                    "product_interest": l.product_interest,
                    "budget": l.budget,
                    "lead_score": l.lead_score,
                    "stage": l.stage,
                    "status": l.status,
                    "notes": l.notes,
                    "last_contact_date": l.last_contact_date,
                    "next_followup_date": l.next_followup_date,
                    "owner": l.owner
                }
                for l in leads
            ]
        finally:
            db.close()
