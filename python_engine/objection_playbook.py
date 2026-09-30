"""
Sales Objection Resolution Engine (Python Implementation)
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

from typing import Dict, Any, Optional

OBJECTION_PLAYBOOK: Dict[str, Dict[str, Any]] = {
    "Price": {
        "concern": "Perceived premium over competitors or budget constraints",
        "script": "I understand budget discipline is critical. When evaluating Worli Sea Face properties, let's look at the net usable efficiency: UrbanNest delivers 82.5% usable carpet ratio compared to the 68% market average. Per usable square foot, your effective acquisition cost is actually 11% lower, plus guaranteed possession backed by MahaRERA escrow.",
        "evidence": "RERA Escrow Account & 82.5% carpet efficiency certificate",
        "follow_up": "Would you like me to share the side-by-side carpet usable analysis comparing our Worli project with Lodha and Piramal?"
    },
    "Timing": {
        "concern": "Delaying decision due to market uncertainty or personal schedules",
        "script": "Waiting is natural when evaluating major capital deployments. However, with Metro Line 4 commissioning in Q4 2026, capital values along Ghodbunder and Kolshet road are projected to rise 14-18%. Securing your unit today locks in the pre-launch price bracket with our 10:90 construction-linked scheme.",
        "evidence": "Metro Line 4 Progress Report & 10:90 Construction Linked Payment Scheme",
        "follow_up": "Can we lock the price on Tower A-32 with a refundable token while you finalize your schedule?"
    },
    "Trust": {
        "concern": "Builder credibility and timely delivery guarantees",
        "script": "Builder track record is the most important factor in MMR luxury real estate. UrbanNest Properties has delivered 14 consecutive residential towers on or ahead of RERA timeline dates across Bandra, Worli, and Thane with zero construction litigation.",
        "evidence": "14 Delivered Towers OC Certificates & MahaRERA Registration P51800045892",
        "follow_up": "Shall I arrange an on-site walkthrough with our Chief Project Engineer this Saturday?"
    },
    "Competition": {
        "concern": "Comparing with alternate developments in the micro-market",
        "script": "Our neighboring projects are respectable developments. The differentiating factors at UrbanNest are private elevator lobbies per residence, 3 reserved EV charging parking slots, and an Olympic-sized infinity sea deck.",
        "evidence": "Competitor Spec-for-Spec Matrix",
        "follow_up": "Would it help if I send our architectural comparison breakdown?"
    }
}


def resolve_objection(category: str, client_name: str = "Client") -> Dict[str, str]:
    """Generates structured consultative objection handling response."""
    data = OBJECTION_PLAYBOOK.get(category, OBJECTION_PLAYBOOK["Price"])
    return {
        "category": category,
        "client": client_name,
        "likely_concern": data["concern"],
        "suggested_response": data["script"].replace("Client", client_name),
        "evidence_needed": data["evidence"],
        "follow_up_question": data["follow_up"]
    }
