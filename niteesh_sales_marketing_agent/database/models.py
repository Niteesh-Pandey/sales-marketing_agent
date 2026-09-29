from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    Index
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class LeadModel(Base):
    __tablename__ = "leads"

    lead_id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False, index=True)
    email = Column(String(120), nullable=False, index=True)
    phone = Column(String(50))
    company = Column(String(120), index=True)
    city = Column(String(50), index=True)
    industry = Column(String(100))
    job_title = Column(String(100))
    source = Column(String(50), index=True)
    product_interest = Column(String(100), index=True)
    budget = Column(Float, default=0.0)
    lead_score = Column(Integer, default=0, index=True)
    intent_score = Column(Integer, default=0)
    fit_score = Column(Integer, default=0)
    engagement_score = Column(Integer, default=0)
    stage = Column(String(50), default="NEW", index=True)
    status = Column(String(50), default="ACTIVE", index=True)
    last_contact_date = Column(String(50))
    next_followup_date = Column(String(50))
    owner = Column(String(100), default="Niteesh Pandey")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProductModel(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False)
    category = Column(String(100))
    price_range = Column(String(100))
    min_price = Column(Float)
    max_price = Column(Float)
    locations = Column(Text)
    configurations = Column(Text)
    highlights = Column(Text)


class CampaignModel(Base):
    __tablename__ = "campaigns"

    id = Column(String(50), primary_key=True)
    name = Column(String(120), nullable=False)
    channel = Column(String(50), index=True)
    date = Column(String(50))
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    leads = Column(Integer, default=0)
    qualified_leads = Column(Integer, default=0)
    meetings = Column(Integer, default=0)
    customers = Column(Integer, default=0)
    spend = Column(Float, default=0.0)
    revenue = Column(Float, default=0.0)


class TaskModel(Base):
    __tablename__ = "tasks"

    task_id = Column(String(50), primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    type = Column(String(50), default="CALL")
    priority = Column(String(50), default="MEDIUM", index=True)
    status = Column(String(50), default="TODO", index=True)
    due_date = Column(String(50))
    related_lead_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class KnowledgeDocumentModel(Base):
    __tablename__ = "knowledge_documents"

    id = Column(String(50), primary_key=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), index=True)
    filename = Column(String(250))
    summary = Column(Text)
    content = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user = Column(String(100), default="Niteesh Pandey")
    action = Column(String(100), index=True)
    tool = Column(String(100))
    target = Column(String(200))
    status = Column(String(50), default="SUCCESS")
    details = Column(Text)
