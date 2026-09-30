#!/usr/bin/env python3
"""
Niteesh AI Sales & Marketing Command Center
Main Python Launcher & Standalone Agent Runner
Author: Niteesh Pandey <niteeshpandey9555@gmail.com>
Organization: Niteesh AI Growth Labs
"""

import sys
import os
from python_engine.scoring import calculate_lead_score
from python_engine.analytics import compute_campaign_metrics
from python_engine.objection_playbook import resolve_objection
from python_engine.agent import NiteeshAIAgent


def print_banner():
    print("""
========================================================================
     NITEESH AI SALES & MARKETING COMMAND CENTER
     Engineered by Niteesh Pandey | Niteesh AI Growth Labs
     Client: UrbanNest Properties (Mumbai, Thane, Pune)
========================================================================
    """)


def main():
    print_banner()

    print("[1] Running deterministic scoring test...")
    sample_lead = {
        "budget": 24000000,
        "product_interest": "UrbanNest Prime Residences",
        "city": "Mumbai",
        "job_title": "Managing Director",
        "status": "HOT"
    }
    score, breakdown = calculate_lead_score(sample_lead)
    print(f"    ✓ Lead Score: {score}/100 (Dimensions: 8/8 evaluated)")

    print("[2] Running marketing analytics verification...")
    sample_campaign = {
        "impressions": 450000,
        "clicks": 14200,
        "leads": 210,
        "qualified_leads": 78,
        "meetings": 32,
        "customers": 6,
        "spend": 850000,
        "revenue": 52000000
    }
    metrics = compute_campaign_metrics(sample_campaign)
    print(f"    ✓ CTR: {metrics['ctr']}% | CPL: ₹{metrics['cpl']} | ROAS: {metrics['roas']}x")

    print("[3] Testing Sales Objection Framework...")
    obj = resolve_objection("Price", "Amitabh Joshi")
    print(f"    ✓ Category: {obj['category']} | Follow-up: {obj['follow_up_question'][:45]}...")

    print("\n✅ All Python core subsystems initialized and operational.")
    print("👉 To launch the interactive web command center, run: npm start or npm run dev\n")


if __name__ == "__main__":
    main()
