"""
Unit tests for deterministic lead scoring engine
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

import unittest
from python_engine.scoring import calculate_lead_score


class TestLeadScoring(unittest.TestCase):
    def test_hot_prime_buyer(self):
        lead = {
            "budget": 25000000,
            "product_interest": "UrbanNest Prime Residences",
            "city": "Mumbai",
            "job_title": "Managing Director",
            "status": "HOT"
        }
        score, breakdown = calculate_lead_score(lead)
        self.assertGreaterEqual(score, 85)
        self.assertEqual(breakdown["budgetFit"], 20)
        self.assertEqual(breakdown["locationFit"], 10)

    def test_low_budget_scoring(self):
        lead = {
            "budget": 4000000,
            "product_interest": "UrbanNest Prime Residences",
            "city": "Delhi",
            "job_title": "Intern",
            "status": "COLD"
        }
        score, breakdown = calculate_lead_score(lead)
        self.assertLessEqual(score, 60)


if __name__ == "__main__":
    unittest.main()
