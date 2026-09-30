"""
Deterministic Lead Scoring Engine (Python Implementation)
Author: Niteesh Pandey (Niteesh AI Growth Labs)

Calculates deterministic score (0-100) across 8 business dimensions:
1. Budget Fit (max 20)
2. Product Fit (max 15)
3. Purchase Intent (max 15)
4. Engagement Recency (max 15)
5. Decision Authority (max 15)
6. Timeline Fit (max 10)
7. Location Fit (max 10)
"""

from typing import Dict, Any, List, Tuple
from datetime import datetime


def calculate_lead_score(lead: Dict[str, Any]) -> Tuple[int, Dict[str, Any]]:
    """Calculates lead score deterministically without hallucination."""
    budget = float(lead.get("budget", 0))
    product = lead.get("product_interest", "")
    city = lead.get("city", "")
    status = lead.get("status", "WARM")
    job_title = lead.get("job_title", "").lower()
    source = lead.get("source", "")
    last_contact = lead.get("last_contact_date", "")

    reasons: List[str] = []

    # 1. Budget Fit (max 20)
    budget_fit = 0
    if "Prime" in product:
        if budget >= 20_000_000:
            budget_fit = 20
            reasons.append("Premium budget matches Prime Luxury Residence (₹2.0 Cr+)")
        elif budget >= 15_000_000:
            budget_fit = 15
        else:
            budget_fit = 8
            reasons.append("Budget below standard Prime tier")
    elif "Select" in product:
        if 8_000_000 <= budget <= 16_000_000:
            budget_fit = 20
            reasons.append("Exact budget match for UrbanNest Select Homes")
        elif budget > 16_000_000:
            budget_fit = 18
        else:
            budget_fit = 10
    else:  # Investor Units
        if budget >= 5_000_000:
            budget_fit = 20
            reasons.append("High capital allocation for Investor Suites")
        else:
            budget_fit = 10

    # 2. Product Fit (max 15)
    product_fit = 12
    if product:
        product_fit = 15
        reasons.append(f"Identified clear configuration interest in {product}")

    # 3. Purchase Intent (max 15)
    intent_fit = 10
    if status == "HOT":
        intent_fit = 15
        reasons.append("Active inbound hot inquiry requesting immediate meeting")
    elif status in ["WARM", "ACTIVE"]:
        intent_fit = 11
    elif status == "COLD":
        intent_fit = 5

    # 4. Engagement Recency (max 15)
    engagement_fit = 10
    if last_contact:
        try:
            days = (datetime.now() - datetime.fromisoformat(last_contact)).days
            if days <= 3:
                engagement_fit = 15
                reasons.append("Contacted within last 72 hours")
            elif days <= 7:
                engagement_fit = 12
            elif days <= 14:
                engagement_fit = 8
            else:
                engagement_fit = 4
        except Exception:
            engagement_fit = 10

    # 5. Decision Authority (max 15)
    decision_fit = 8
    exec_titles = ["director", "ceo", "founder", "partner", "vp", "head", "cxo", "president", "owner", "md"]
    if any(t in job_title for t in exec_titles):
        decision_fit = 15
        reasons.append("C-Suite / Executive decision-maker with sole purchasing authority")
    elif any(t in job_title for t in ["manager", "lead", "architect", "consultant", "senior"]):
        decision_fit = 12
        reasons.append("Senior professional with direct purchase authorization")

    # 6. Timeline Fit (max 10)
    timeline_fit = 8
    if status == "HOT":
        timeline_fit = 10
    elif status == "WARM":
        timeline_fit = 7

    # 7. Location Fit (max 10)
    location_fit = 6
    if city in ["Mumbai", "Thane", "Pune"]:
        location_fit = 10
        reasons.append(f"Located in primary service territory: {city}")

    total_score = min(100, budget_fit + product_fit + intent_fit + engagement_fit + decision_fit + timeline_fit + location_fit)

    breakdown = {
        "budgetFit": budget_fit,
        "productFit": product_fit,
        "purchaseIntent": intent_fit,
        "engagementRecency": engagement_fit,
        "decisionAuthority": decision_fit,
        "timelineFit": timeline_fit,
        "locationFit": location_fit,
        "totalScore": total_score,
        "reasons": reasons
    }

    return total_score, breakdown
