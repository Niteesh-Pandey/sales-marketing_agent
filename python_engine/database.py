"""
PostgreSQL & SQLite Dual-Engine Database Layer (SQLAlchemy ORM)
Author: Niteesh Pandey (Niteesh AI Growth Labs)
"""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///niteesh_growth_labs.db")

Base = declarative_base()


class LeadModel(Base):
    __tablename__ = "crm_leads"

    lead_id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    company = Column(String(150))
    city = Column(String(50), default="Mumbai")
    industry = Column(String(100))
    job_title = Column(String(100))
    source = Column(String(100), default="Website")
    product_interest = Column(String(150))
    budget = Column(Float, default=0.0)
    lead_score = Column(Integer, default=0)
    stage = Column(String(50), default="NEW")
    status = Column(String(50), default="WARM")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CampaignModel(Base):
    __tablename__ = "marketing_campaigns"

    id = Column(String(50), primary_key=True)
    name = Column(String(150), nullable=False)
    channel = Column(String(100), nullable=False)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    leads = Column(Integer, default=0)
    qualified_leads = Column(Integer, default=0)
    meetings = Column(Integer, default=0)
    customers = Column(Integer, default=0)
    spend = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user = Column(String(100), default="Niteesh Pandey")
    action = Column(String(100), nullable=False)
    tool = Column(String(100))
    target = Column(String(150))
    status = Column(String(50), default="SUCCESS")
    details = Column(Text)


def get_db_engine():
    """Returns database engine with PostgreSQL or SQLite fallback."""
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(engine)
        return engine
    except Exception as e:
        print(f"PostgreSQL connection fallback to SQLite: {e}")
        engine = create_engine("sqlite:///niteesh_growth_labs.db")
        Base.metadata.create_all(engine)
        return engine


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_db_engine())
