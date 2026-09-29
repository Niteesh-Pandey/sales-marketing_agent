import { Lead, ScoreBreakdown } from '../types';

export function calculateDeterministicLeadScore(lead: Partial<Lead>): {
  lead_score: number;
  intent_score: number;
  fit_score: number;
  engagement_score: number;
  score_breakdown: ScoreBreakdown;
  ai_priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommended_next_action: 'CALL' | 'EMAIL' | 'WHATSAPP_DRAFT' | 'MEETING' | 'FOLLOW_UP' | 'NURTURE' | 'NO_ACTION';
  ai_priority_reason: string;
} {
  const reasons: string[] = [];
  let budgetFit = 0;
  let productFit = 0;
  let purchaseIntent = 0;
  let engagementRecency = 0;
  let decisionAuthority = 0;
  let timelineFit = 0;
  let locationFit = 0;

  const budget = Number(lead.budget) || 0;
  const product = lead.product_interest || '';
  const city = lead.city || '';
  const title = (lead.job_title || '').toLowerCase();
  const notes = (lead.notes || '').toLowerCase();
  const stage = lead.stage || 'NEW';
  const lastContact = lead.last_contact_date ? new Date(lead.last_contact_date) : new Date();
  const daysSinceContact = Math.max(0, Math.floor((Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24)));

  // 1. Budget Fit (Max 20)
  // Product price brackets:
  // UrbanNest Prime: ₹1.2 Cr - ₹2.5 Cr (12,000,000 - 25,000,000)
  // UrbanNest Select: ₹75 Lakh - ₹1.35 Cr (7,500,000 - 13,500,000)
  // UrbanNest Investor: ₹90 Lakh - ₹1.8 Cr (9,000,000 - 18,000,000)
  if (product.includes('Prime')) {
    if (budget >= 12000000) {
      budgetFit = 20;
      reasons.push('Budget (₹' + (budget / 10000000).toFixed(2) + ' Cr) fully matches Prime Residences range (₹1.2Cr–₹2.5Cr)');
    } else if (budget >= 10000000) {
      budgetFit = 12;
      reasons.push('Budget within 15% margin of Prime Residences entry price');
    } else {
      budgetFit = 5;
      reasons.push('Budget below typical Prime Residences requirements');
    }
  } else if (product.includes('Select')) {
    if (budget >= 7500000) {
      budgetFit = 20;
      reasons.push('Budget aligns with Select Homes range (₹75L–₹1.35Cr)');
    } else if (budget >= 6000000) {
      budgetFit = 12;
      reasons.push('Budget slightly below median Select Homes pricing');
    } else {
      budgetFit = 4;
    }
  } else if (product.includes('Investor')) {
    if (budget >= 9000000) {
      budgetFit = 20;
      reasons.push('High-yield Investor units budget verified (₹90L+)');
    } else {
      budgetFit = 10;
    }
  } else {
    budgetFit = budget >= 10000000 ? 16 : 10;
  }

  // 2. Product Fit (Max 15)
  if (product) {
    productFit = 15;
    reasons.push(`Clear interest registered in ${product}`);
  } else {
    productFit = 5;
  }

  // 3. Purchase Intent (Max 15)
  if (notes.includes('immediate') || notes.includes('ready to buy') || notes.includes('pre-approved') || notes.includes('cheque') || notes.includes('token') || notes.includes('urgent')) {
    purchaseIntent = 15;
    reasons.push('High urgency cues detected in client notes (pre-approval / immediate move)');
  } else if (notes.includes('site visit') || notes.includes('interested') || notes.includes('comparing') || notes.includes('shortlisted')) {
    purchaseIntent = 12;
    reasons.push('Active shopping behavior with site visit / comparison intent');
  } else if (stage === 'PROPOSAL' || stage === 'NEGOTIATION') {
    purchaseIntent = 14;
    reasons.push(`Advanced funnel stage: ${stage}`);
  } else if (stage === 'MEETING') {
    purchaseIntent = 11;
  } else {
    purchaseIntent = 7;
  }

  // 4. Engagement Recency (Max 15)
  if (daysSinceContact <= 2) {
    engagementRecency = 15;
    reasons.push('Recent contact within last 48 hours');
  } else if (daysSinceContact <= 7) {
    engagementRecency = 12;
    reasons.push('Active engagement in the past week');
  } else if (daysSinceContact <= 14) {
    engagementRecency = 8;
  } else {
    engagementRecency = 3;
    reasons.push('Engagement cooling off (>14 days without interaction)');
  }

  // 5. Decision Authority (Max 15)
  if (
    title.includes('founder') ||
    title.includes('director') ||
    title.includes('cxo') ||
    title.includes('ceo') ||
    title.includes('vp') ||
    title.includes('head') ||
    title.includes('partner') ||
    title.includes('owner') ||
    title.includes('managing')
  ) {
    decisionAuthority = 15;
    reasons.push('Decision-maker role / C-level / Founder profile');
  } else if (title.includes('manager') || title.includes('lead') || title.includes('senior') || title.includes('doctor') || title.includes('consultant')) {
    decisionAuthority = 12;
    reasons.push('Senior professional / High-income earner profile');
  } else {
    decisionAuthority = 8;
  }

  // 6. Timeline Fit (Max 10)
  if (notes.includes('30 days') || notes.includes('this month') || notes.includes('immediate')) {
    timelineFit = 10;
    reasons.push('Buying timeline within 30 days');
  } else if (notes.includes('60 days') || notes.includes('next quarter') || notes.includes('soon')) {
    timelineFit = 8;
    reasons.push('Buying timeline under 60-90 days');
  } else {
    timelineFit = 5;
  }

  // 7. Location Fit (Max 10)
  if (['Mumbai', 'Thane', 'Pune'].includes(city)) {
    locationFit = 10;
    reasons.push(`Exact geographic focus: ${city} target market`);
  } else {
    locationFit = 5;
  }

  const overallScore = Math.min(100, budgetFit + productFit + purchaseIntent + engagementRecency + decisionAuthority + timelineFit + locationFit);

  // Sub-scores normalized to 0-100
  const intentScore = Math.min(100, Math.round(((purchaseIntent + timelineFit) / 25) * 100));
  const fitScore = Math.min(100, Math.round(((budgetFit + productFit + locationFit) / 45) * 100));
  const engagementScore = Math.min(100, Math.round(((engagementRecency + decisionAuthority) / 30) * 100));

  let ai_priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  let recommended_next_action: 'CALL' | 'EMAIL' | 'WHATSAPP_DRAFT' | 'MEETING' | 'FOLLOW_UP' | 'NURTURE' | 'NO_ACTION' = 'FOLLOW_UP';

  if (overallScore >= 75) {
    ai_priority = 'HIGH';
    if (stage === 'NEW' || stage === 'CONTACTED') {
      recommended_next_action = 'CALL';
    } else if (stage === 'QUALIFIED') {
      recommended_next_action = 'MEETING';
    } else if (stage === 'PROPOSAL' || stage === 'NEGOTIATION') {
      recommended_next_action = 'CALL';
    } else {
      recommended_next_action = 'WHATSAPP_DRAFT';
    }
  } else if (overallScore >= 50) {
    ai_priority = 'MEDIUM';
    recommended_next_action = stage === 'NEW' ? 'WHATSAPP_DRAFT' : 'EMAIL';
  } else {
    ai_priority = 'LOW';
    recommended_next_action = 'NURTURE';
  }

  const ai_priority_reason = reasons.slice(0, 3).join('. ') + '.';

  return {
    lead_score: overallScore,
    intent_score: intentScore,
    fit_score: fitScore,
    engagement_score: engagementScore,
    score_breakdown: {
      budgetFit,
      productFit,
      purchaseIntent,
      engagementRecency,
      decisionAuthority,
      timelineFit,
      locationFit,
      reasons,
    },
    ai_priority,
    recommended_next_action,
    ai_priority_reason,
  };
}
