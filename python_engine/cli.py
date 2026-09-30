"""
Command-Line Interface (CLI) for Niteesh AI Command Center
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

import sys
import argparse
from .scoring import calculate_lead_score
from .analytics import compute_campaign_metrics
from .objection_playbook import resolve_objection
from .agent import NiteeshAIAgent


def main():
    parser = argparse.ArgumentParser(description="Niteesh AI Sales & Marketing CLI")
    subparsers = parser.add_subparsers(dest="command")

    # Command: score
    score_p = subparsers.add_parser("score", help="Score a prospective buyer")
    score_p.add_argument("--budget", type=float, required=True, help="Budget in INR")
    score_p.add_argument("--product", type=str, default="UrbanNest Prime Residences")
    score_p.add_argument("--city", type=str, default="Mumbai")
    score_p.add_argument("--title", type=str, default="Managing Director")
    score_p.add_argument("--status", type=str, default="HOT")

    # Command: objection
    obj_p = subparsers.add_parser("objection", help="Resolve a client objection")
    obj_p.add_argument("--category", type=str, choices=["Price", "Timing", "Trust", "Competition"], default="Price")
    obj_p.add_argument("--client", type=str, default="Amitabh Joshi")

    # Command: ask
    ask_p = subparsers.add_parser("ask", help="Ask the AI copilot agent")
    ask_p.add_argument("query", type=str, help="Prompt query")

    args = parser.parse_args()

    if args.command == "score":
        lead_data = {
            "budget": args.budget,
            "product_interest": args.product,
            "city": args.city,
            "job_title": args.title,
            "status": args.status
        }
        score, breakdown = calculate_lead_score(lead_data)
        print("\n" + "="*50)
        print(f"📊 Deterministic Score: {score}/100")
        print("="*50)
        for k, v in breakdown.items():
            if k != "reasons":
                print(f"  - {k}: {v}")
        print("\nReasons:")
        for r in breakdown.get("reasons", []):
            print(f"  • {r}")
        print("="*50 + "\n")

    elif args.command == "objection":
        res = resolve_objection(args.category, args.client)
        print("\n" + "="*50)
        print(f"🎯 Objection Playbook: {res['category']} ({res['client']})")
        print("="*50)
        print(f"Likely Concern: {res['likely_concern']}")
        print(f"\nConsultative Script:\n{res['suggested_response']}")
        print(f"\nRequired Proof:\n{res['evidence_needed']}")
        print(f"\nFollow-up Question:\n{res['follow_up_question']}")
        print("="*50 + "\n")

    elif args.command == "ask":
        agent = NiteeshAIAgent()
        print(f"\n🤖 Prompting Niteesh AI Copilot with: '{args.query}'...\n")
        response = agent.ask(args.query)
        print(response + "\n")

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
