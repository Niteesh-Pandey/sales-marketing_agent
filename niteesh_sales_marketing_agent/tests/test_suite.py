import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from database.db import init_db, SessionLocal
from database.models import LeadModel, TaskModel
from services.lead_service import LeadService
from services.analytics_service import AnalyticsService
from rag.chunker import DocumentChunker
from rag.retriever import local_retriever

def test_database_initialization_and_crud():
    init_db()
    db = SessionLocal()
    # Test Create
    test_lead = LeadModel(
        lead_id="TEST-001",
        name="Test Client",
        email="test@client.com",
        city="Mumbai",
        product_interest="UrbanNest Prime Residences",
        budget=15000000.0,
        lead_score=85,
        stage="NEW"
    )
    db.add(test_lead)
    db.commit()

    # Test Read
    retrieved = db.query(LeadModel).filter(LeadModel.lead_id == "TEST-001").first()
    assert retrieved is not None
    assert retrieved.name == "Test Client"
    assert retrieved.budget == 15000000.0

    # Test Delete
    db.delete(retrieved)
    db.commit()
    assert db.query(LeadModel).filter(LeadModel.lead_id == "TEST-001").first() is None
    db.close()

def test_deterministic_lead_scoring():
    score = LeadService.calculate_score(
        budget=22000000.0,
        product="UrbanNest Prime Residences",
        city="Mumbai",
        title="Chief Technology Officer",
        notes="Pre-approved HDFC loan, ready for immediate token.",
        stage="NEGOTIATION"
    )
    assert score["lead_score"] >= 80
    assert score["ai_priority"] == "HIGH"
    assert score["recommended_next_action"] == "CALL"
    assert len(score["reasons"]) > 0

def test_marketing_analytics_formulas():
    metrics = AnalyticsService.calculate_marketing_metrics(
        impressions=10000,
        clicks=500,
        leads=50,
        qualified_leads=20,
        meetings=10,
        customers=2,
        spend=50000.0,
        revenue=20000000.0
    )
    # CTR = 500 / 10000 * 100 = 5.0%
    assert metrics["ctr"] == 5.0
    # CPC = 50000 / 500 = ₹100
    assert metrics["cpc"] == 100.0
    # CPL = 50000 / 50 = ₹1000
    assert metrics["cpl"] == 1000.0
    # ROAS = 20000000 / 50000 = 400x
    assert metrics["roas"] == 400.0

def test_rag_chunking_and_retrieval():
    text = "UrbanNest Properties offers an 82% usable carpet efficiency on all residential luxury apartments in Mumbai."
    chunks = DocumentChunker.chunk_text(text, chunk_size=50)
    assert len(chunks) >= 1

    matches = local_retriever.search("carpet efficiency", top_k=2)
    assert isinstance(matches, list)

if __name__ == "__main__":
    test_database_initialization_and_crud()
    test_deterministic_lead_scoring()
    test_marketing_analytics_formulas()
    test_rag_chunking_and_retrieval()
    print("All tests passed successfully!")
