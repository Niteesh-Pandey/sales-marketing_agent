export type LeadStage =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'MEETING'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'NURTURE';

export type LeadStatus =
  | 'HOT'
  | 'WARM'
  | 'COLD'
  | 'ACTIVE'
  | 'CONVERTED'
  | 'LOST';

export interface ScoreBreakdown {
  budgetFit: number;        // max 20
  productFit: number;       // max 15
  purchaseIntent: number;   // max 15
  engagementRecency: number;// max 15
  decisionAuthority: number;// max 15
  timelineFit: number;      // max 10
  locationFit: number;      // max 10
  reasons: string[];
}

export interface Lead {
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: 'Mumbai' | 'Thane' | 'Pune' | string;
  industry: string;
  job_title: string;
  source: 'Website' | 'LinkedIn Ad' | 'Google Search' | 'Referral' | 'Property Expo' | 'Instagram' | 'Channel Partner' | string;
  product_interest: 'UrbanNest Prime Residences' | 'UrbanNest Select Homes' | 'UrbanNest Investor Units' | string;
  budget: number; // in INR
  lead_score: number; // 0-100 deterministic
  intent_score: number; // 0-100
  fit_score: number; // 0-100
  engagement_score: number; // 0-100
  score_breakdown?: ScoreBreakdown;
  ai_priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  ai_priority_reason?: string;
  recommended_next_action?: 'CALL' | 'EMAIL' | 'WHATSAPP_DRAFT' | 'MEETING' | 'FOLLOW_UP' | 'NURTURE' | 'NO_ACTION';
  stage: LeadStage;
  status: LeadStatus;
  last_contact_date: string;
  next_followup_date: string;
  owner: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Google Search' | 'LinkedIn Ads' | 'Meta/Instagram' | 'Email' | 'Channel Partner' | 'Property Portal';
  date: string;
  impressions: number;
  clicks: number;
  leads: number;
  qualified_leads: number;
  meetings: number;
  customers: number;
  spend: number; // in INR
  revenue: number; // in INR
}

export interface CampaignCalculatedMetrics {
  ctr: number; // Click Through Rate %
  cpc: number; // Cost Per Click ₹
  cpl: number; // Cost Per Lead ₹
  leadConversionRate: number; // %
  qualifiedLeadRate: number; // %
  meetingRate: number; // %
  customerConversionRate: number; // %
  cac: number; // Customer Acquisition Cost ₹
  roas: number; // Return on Ad Spend (e.g. 4.5x)
  roi: number; // ROI %
}

export interface Task {
  task_id: string;
  title: string;
  description: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'PROPOSAL' | 'REVIEW' | 'MARKETING';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  due_date: string;
  related_lead_id?: string;
  related_lead_name?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  tool: string;
  target: string;
  status: 'SUCCESS' | 'WARNING' | 'REJECTED' | 'FAILED';
  details: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'company' | 'products' | 'pricing' | 'customers' | 'sales' | 'marketing' | 'competitors' | 'policies' | 'templates';
  filename: string;
  summary: string;
  content: string;
  updated_at: string;
}

export interface MeetingAnalysis {
  participants: string[];
  customer_need: string;
  pain_points: string[];
  budget: string;
  timeline: string;
  objections: string[];
  requirements: string[];
  competitors_mentioned: string[];
  commitments: string[];
  next_steps: string[];
  follow_up_date: string;
  potential_opportunity: string;
  risk_factors: string[];
  summary: string;
}

export interface DayPlanSlot {
  timeSlot: 'Morning' | 'Midday' | 'Afternoon' | 'End-of-day';
  tasks: {
    task: string;
    reason: string;
    expectedImpact: string;
    estimatedEffort: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    evidence: string;
  }[];
}

export interface ObjectionResponse {
  objection: string;
  category: string;
  likelyConcern: string;
  suggestedResponse: string;
  proofEvidenceNeeded: string;
  followUpQuestion: string;
  nextStep: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: {
    name: string;
    args: any;
    result?: any;
  }[];
  evidence?: {
    source: string;
    section?: string;
    quote?: string;
    confidence?: number;
  }[];
  requiresApproval?: {
    action: string;
    target: string;
    data: any;
    risk: string;
    id: string;
  };
}

export interface ModelOption {
  id: string;
  name: string;
  tier: string;
}

export interface SystemSettings {
  owner_name: string;
  company_name: string;
  demo_client: string;
  database_type: string;
  postgres_url: string;
  primary_model: string;
  fallback_model: string;
  app_status: string;
  supported_models: ModelOption[];
}
