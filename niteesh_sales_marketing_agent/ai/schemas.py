from pydantic import BaseModel, Field
from typing import List, Optional

class LeadScoreResponse(BaseModel):
    lead_score: int = Field(..., ge=0, le=100)
    intent_score: int = Field(..., ge=0, le=100)
    fit_score: int = Field(..., ge=0, le=100)
    engagement_score: int = Field(..., ge=0, le=100)
    ai_priority: str
    recommended_next_action: str
    reasons: List[str]

class ObjectionAnalysisResponse(BaseModel):
    objection: str
    likely_concern: str
    suggested_response: str
    proof_evidence_needed: str
    follow_up_question: str
    next_step: str

class MarketingContentResponse(BaseModel):
    hook: str
    main_message: str
    proof_evidence: str
    cta: str
    variant_a: str
    variant_b: str

class MeetingExtractionResponse(BaseModel):
    participants: List[str]
    customer_need: str
    pain_points: List[str]
    budget: str
    timeline: str
    objections: List[str]
    requirements: List[str]
    competitors_mentioned: List[str]
    commitments: List[str]
    next_steps: List[str]
    follow_up_date: str
    summary: str
