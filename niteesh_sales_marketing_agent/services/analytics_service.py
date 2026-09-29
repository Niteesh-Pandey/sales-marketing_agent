from typing import Dict, List
import pandas as pd

class AnalyticsService:
    @staticmethod
    def calculate_marketing_metrics(
        impressions: int,
        clicks: int,
        leads: int,
        qualified_leads: int,
        meetings: int,
        customers: int,
        spend: float,
        revenue: float
    ) -> Dict:
        ctr = (clicks / impressions * 100) if impressions > 0 else 0.0
        cpc = (spend / clicks) if clicks > 0 else 0.0
        cpl = (spend / leads) if leads > 0 else 0.0
        lead_conv_rate = (leads / clicks * 100) if clicks > 0 else 0.0
        qual_lead_rate = (qualified_leads / leads * 100) if leads > 0 else 0.0
        meeting_rate = (meetings / qualified_leads * 100) if qualified_leads > 0 else 0.0
        cust_conv_rate = (customers / meetings * 100) if meetings > 0 else 0.0
        cac = (spend / customers) if customers > 0 else 0.0
        roas = (revenue / spend) if spend > 0 else 0.0
        roi = ((revenue - spend) / spend * 100) if spend > 0 else 0.0

        return {
            "ctr": round(ctr, 2),
            "cpc": round(cpc, 2),
            "cpl": round(cpl, 2),
            "lead_conversion_rate": round(lead_conv_rate, 2),
            "qualified_lead_rate": round(qual_lead_rate, 2),
            "meeting_rate": round(meeting_rate, 2),
            "customer_conversion_rate": round(cust_conv_rate, 2),
            "cac": round(cac, 0),
            "roas": round(roas, 2),
            "roi": round(roi, 1),
            "revenue": revenue
        }
