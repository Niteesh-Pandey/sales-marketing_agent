"""
Marketing Analytics & Attribution Mathematics (Python Implementation)
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

from typing import Dict, Any


def compute_campaign_metrics(campaign: Dict[str, Any]) -> Dict[str, float]:
    """Computes all 11 marketing KPIs mathematically."""
    impressions = int(campaign.get("impressions", 0))
    clicks = int(campaign.get("clicks", 0))
    leads = int(campaign.get("leads", 0))
    qualified = int(campaign.get("qualified_leads", 0))
    meetings = int(campaign.get("meetings", 0))
    customers = int(campaign.get("customers", 0))
    spend = float(campaign.get("spend", 0))
    revenue = float(campaign.get("revenue", 0))

    ctr = (clicks / impressions * 100) if impressions > 0 else 0.0
    cpc = (spend / clicks) if clicks > 0 else 0.0
    cpl = (spend / leads) if leads > 0 else 0.0
    lead_conv_rate = (leads / clicks * 100) if clicks > 0 else 0.0
    qual_rate = (qualified / leads * 100) if leads > 0 else 0.0
    meeting_rate = (meetings / qualified * 100) if qualified > 0 else 0.0
    customer_rate = (customers / meetings * 100) if meetings > 0 else 0.0
    cac = (spend / customers) if customers > 0 else 0.0
    roas = (revenue / spend) if spend > 0 else 0.0
    roi = ((revenue - spend) / spend * 100) if spend > 0 else 0.0

    return {
        "ctr": round(ctr, 2),
        "cpc": round(cpc, 2),
        "cpl": round(cpl, 2),
        "leadConversionRate": round(lead_conv_rate, 2),
        "qualifiedLeadRate": round(qual_rate, 2),
        "meetingRate": round(meeting_rate, 2),
        "customerConversionRate": round(customer_rate, 2),
        "cac": round(cac, 2),
        "roas": round(roas, 2),
        "roi": round(roi, 2)
    }
