"""
Unit tests for marketing attribution mathematics
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

import unittest
from python_engine.analytics import compute_campaign_metrics


class TestMarketingAnalytics(unittest.TestCase):
    def test_roas_and_ctr_computation(self):
        campaign = {
            "impressions": 100000,
            "clicks": 5000,
            "leads": 200,
            "qualified_leads": 50,
            "meetings": 20,
            "customers": 5,
            "spend": 100000,
            "revenue": 500000
        }
        res = compute_campaign_metrics(campaign)
        self.assertEqual(res["ctr"], 5.0)
        self.assertEqual(res["cpc"], 20.0)
        self.assertEqual(res["cpl"], 500.0)
        self.assertEqual(res["roas"], 5.0)
        self.assertEqual(res["roi"], 400.0)


if __name__ == "__main__":
    unittest.main()
