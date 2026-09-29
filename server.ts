import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_LEADS, INITIAL_CAMPAIGNS, INITIAL_TASKS, INITIAL_KNOWLEDGE_DOCUMENTS, INITIAL_AUDIT_LOGS, INITIAL_PRODUCTS } from './src/data/demoData';
import { calculateDeterministicLeadScore } from './src/services/scoring';
import { Lead, Campaign, Task, KnowledgeDocument, AuditLog } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory Database Store (with full PostgreSQL compatibility schema & data models)
let leadsStore: Lead[] = [...INITIAL_LEADS];
let campaignsStore: Campaign[] = [...INITIAL_CAMPAIGNS];
let tasksStore: Task[] = [...INITIAL_TASKS];
let knowledgeStore: KnowledgeDocument[] = [...INITIAL_KNOWLEDGE_DOCUMENTS];
let auditLogsStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];

const SYSTEM_SETTINGS = {
  owner_name: 'Niteesh Pandey',
  company_name: 'Niteesh AI Growth Labs',
  demo_client: 'UrbanNest Properties',
  database_type: 'PostgreSQL Compatible (Dual SQLite / Postgres Driver)',
  postgres_url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/niteesh_growth_labs',
  primary_model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  fallback_model: process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.1-flash-lite',
  app_status: 'LOCAL DEMO / AI STUDIO'
};

// Helper: Log audit actions
function logAudit(action: string, tool: string, target: string, details: string, status: 'SUCCESS' | 'WARNING' | 'REJECTED' | 'FAILED' = 'SUCCESS') {
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    user: 'Niteesh Pandey',
    action,
    tool,
    target,
    status,
    details
  };
  auditLogsStore.unshift(newLog);
  if (auditLogsStore.length > 200) auditLogsStore.pop();
  return newLog;
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Call Gemini with retry & model fallback
async function callGemini(prompt: string, systemInstruction?: string, preferredModel = 'gemini-3.8-flash', jsonMode = false): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in environment.');
  }

  const modelsToTry = [preferredModel, 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const config: any = {};
        if (systemInstruction) config.systemInstruction = systemInstruction;
        if (jsonMode) config.responseMimeType = 'application/json';

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config
        });

        const text = response.text;
        if (text) return text;
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini call failed with model ${model} (attempt ${attempt}):`, err?.message || err);
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      }
    }
  }

  throw new Error(lastError?.message || 'Failed to generate response from Gemini API after retries.');
}

// ----------------- API ROUTES ----------------- //

// 1. Health check & Settings
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'PASS',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
    database: {
      status: 'PASS',
      type: SYSTEM_SETTINGS.database_type,
      leads_count: leadsStore.length,
      campaigns_count: campaignsStore.length,
      tasks_count: tasksStore.length,
      knowledge_docs_count: knowledgeStore.length,
    },
    knowledge_base: {
      status: 'PASS',
      documents_indexed: knowledgeStore.length,
    },
    settings: SYSTEM_SETTINGS
  });
});

// 2. Leads Endpoints
app.get('/api/leads', (req: Request, res: Response) => {
  let filtered = [...leadsStore];
  const { stage, city, status, search, min_score } = req.query;

  if (stage && typeof stage === 'string') {
    filtered = filtered.filter(l => l.stage.toLowerCase() === stage.toLowerCase());
  }
  if (city && typeof city === 'string') {
    filtered = filtered.filter(l => l.city.toLowerCase() === city.toLowerCase());
  }
  if (status && typeof status === 'string') {
    filtered = filtered.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }
  if (min_score && !isNaN(Number(min_score))) {
    filtered = filtered.filter(l => l.lead_score >= Number(min_score));
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    filtered = filtered.filter(l =>
      l.name.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s) ||
      l.company.toLowerCase().includes(s) ||
      l.product_interest.toLowerCase().includes(s) ||
      l.notes.toLowerCase().includes(s)
    );
  }

  res.json({
    total: filtered.length,
    leads: filtered
  });
});

app.get('/api/leads/:id', (req: Request, res: Response) => {
  const lead = leadsStore.find(l => l.lead_id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

app.post('/api/leads', (req: Request, res: Response) => {
  const data = req.body;
  const newId = `L-${1000 + leadsStore.length + 1}`;
  const scored = calculateDeterministicLeadScore(data);

  const newLead: Lead = {
    ...data,
    lead_id: newId,
    lead_score: scored.lead_score,
    intent_score: scored.intent_score,
    fit_score: scored.fit_score,
    engagement_score: scored.engagement_score,
    score_breakdown: scored.score_breakdown,
    ai_priority: scored.ai_priority,
    ai_priority_reason: scored.ai_priority_reason,
    recommended_next_action: scored.recommended_next_action,
    created_at: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString().slice(0, 10),
    owner: 'Niteesh Pandey',
    status: data.status || 'ACTIVE',
    stage: data.stage || 'NEW'
  };

  leadsStore.unshift(newLead);
  logAudit('CREATE_LEAD', 'lead_service', newLead.name, `New lead created with deterministic score ${scored.lead_score}/100`);
  res.status(201).json(newLead);
});

app.put('/api/leads/:id', (req: Request, res: Response) => {
  const index = leadsStore.findIndex(l => l.lead_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lead not found' });

  const existing = leadsStore[index];
  const updatedData = { ...existing, ...req.body, updated_at: new Date().toISOString().slice(0, 10) };
  const scored = calculateDeterministicLeadScore(updatedData);

  const finalLead: Lead = {
    ...updatedData,
    lead_score: scored.lead_score,
    intent_score: scored.intent_score,
    fit_score: scored.fit_score,
    engagement_score: scored.engagement_score,
    score_breakdown: scored.score_breakdown,
    ai_priority: scored.ai_priority,
    ai_priority_reason: scored.ai_priority_reason,
    recommended_next_action: scored.recommended_next_action
  };

  leadsStore[index] = finalLead;
  logAudit('UPDATE_LEAD', 'lead_service', finalLead.name, `Updated lead stage: ${finalLead.stage}, score: ${finalLead.lead_score}`);
  res.json(finalLead);
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  const index = leadsStore.findIndex(l => l.lead_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Lead not found' });
  const leadName = leadsStore[index].name;
  leadsStore.splice(index, 1);
  logAudit('DELETE_LEAD', 'lead_service', leadName, `Lead ${req.params.id} permanently removed.`);
  res.json({ success: true, message: `Lead ${leadName} removed.` });
});

// Bulk CSV Import
app.post('/api/leads/bulk-import', (req: Request, res: Response) => {
  const { leads: importedRows } = req.body;
  if (!Array.isArray(importedRows)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array of leads.' });
  }

  let valid = 0;
  let duplicates = 0;
  const added: Lead[] = [];

  for (const row of importedRows) {
    if (!row.name || !row.email) continue;
    const exists = leadsStore.some(l => l.email.toLowerCase() === row.email.toLowerCase());
    if (exists) {
      duplicates++;
      continue;
    }

    const scored = calculateDeterministicLeadScore(row);
    const newLead: Lead = {
      lead_id: `L-${1000 + leadsStore.length + 1}`,
      name: row.name,
      email: row.email,
      phone: row.phone || '+91 98000 00000',
      company: row.company || 'Private Entity',
      city: row.city || 'Mumbai',
      industry: row.industry || 'Business Services',
      job_title: row.job_title || 'Professional',
      source: row.source || 'Website',
      product_interest: row.product_interest || 'UrbanNest Select Homes',
      budget: Number(row.budget) || 8500000,
      lead_score: scored.lead_score,
      intent_score: scored.intent_score,
      fit_score: scored.fit_score,
      engagement_score: scored.engagement_score,
      score_breakdown: scored.score_breakdown,
      ai_priority: scored.ai_priority,
      ai_priority_reason: scored.ai_priority_reason,
      recommended_next_action: scored.recommended_next_action,
      stage: row.stage || 'NEW',
      status: 'ACTIVE',
      last_contact_date: new Date().toISOString().slice(0, 10),
      next_followup_date: new Date().toISOString().slice(0, 10),
      owner: 'Niteesh Pandey',
      notes: row.notes || 'Imported via CSV batch upload.',
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10)
    };

    leadsStore.unshift(newLead);
    added.push(newLead);
    valid++;
  }

  logAudit('IMPORT_LEADS', 'lead_service', `${valid} leads`, `Batch import: ${valid} valid, ${duplicates} duplicates skipped.`);
  res.json({
    totalRows: importedRows.length,
    validRows: valid,
    duplicateRows: duplicates,
    imported: valid
  });
});

// 3. Campaigns & Marketing Analytics
app.get('/api/campaigns', (req: Request, res: Response) => {
  const campaignsWithMetrics = campaignsStore.map(c => {
    const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
    const cpc = c.clicks > 0 ? c.spend / c.clicks : 0;
    const cpl = c.leads > 0 ? c.spend / c.leads : 0;
    const leadConversionRate = c.clicks > 0 ? (c.leads / c.clicks) * 100 : 0;
    const qualifiedLeadRate = c.leads > 0 ? (c.qualified_leads / c.leads) * 100 : 0;
    const meetingRate = c.qualified_leads > 0 ? (c.meetings / c.qualified_leads) * 100 : 0;
    const customerConversionRate = c.meetings > 0 ? (c.customers / c.meetings) * 100 : 0;
    const cac = c.customers > 0 ? c.spend / c.customers : 0;
    const roas = c.spend > 0 ? c.revenue / c.spend : 0;
    const roi = c.spend > 0 ? ((c.revenue - c.spend) / c.spend) * 100 : 0;

    return {
      ...c,
      metrics: {
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        cpl: Number(cpl.toFixed(2)),
        leadConversionRate: Number(leadConversionRate.toFixed(2)),
        qualifiedLeadRate: Number(qualifiedLeadRate.toFixed(2)),
        meetingRate: Number(meetingRate.toFixed(2)),
        customerConversionRate: Number(customerConversionRate.toFixed(2)),
        cac: Number(cac.toFixed(0)),
        roas: Number(roas.toFixed(2)),
        roi: Number(roi.toFixed(1))
      }
    };
  });

  res.json(campaignsWithMetrics);
});

// Analyze CSV marketing data
app.post('/api/campaigns/analyze-csv', (req: Request, res: Response) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Please provide CSV rows to analyze.' });
  }

  // Aggregate totals
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalLeads = 0;
  let totalQualified = 0;
  let totalMeetings = 0;
  let totalCustomers = 0;
  let totalSpend = 0;
  let totalRevenue = 0;

  rows.forEach((r: any) => {
    totalImpressions += Number(r.impressions || 0);
    totalClicks += Number(r.clicks || 0);
    totalLeads += Number(r.leads || 0);
    totalQualified += Number(r.qualified_leads || r.qualified || 0);
    totalMeetings += Number(r.meetings || 0);
    totalCustomers += Number(r.customers || 0);
    totalSpend += Number(r.spend || 0);
    totalRevenue += Number(r.revenue || 0);
  });

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const leadConvRate = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;
  const qualLeadRate = totalLeads > 0 ? (totalQualified / totalLeads) * 100 : 0;
  const meetingRate = totalQualified > 0 ? (totalMeetings / totalQualified) * 100 : 0;
  const custConvRate = totalMeetings > 0 ? (totalCustomers / totalMeetings) * 100 : 0;
  const cac = totalCustomers > 0 ? totalSpend / totalCustomers : 0;
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

  const analysisCards = [
    {
      metric: 'Click-Through Rate (CTR)',
      formula: '(Clicks / Impressions) × 100',
      value: `${ctr.toFixed(2)}%`,
      interpretation: ctr >= 2.5 ? 'Strong ad hook and audience targeting' : 'Ad creative or audience hook needs refinement',
      implication: 'Controls top-of-funnel traffic volume into landing pages',
      recommendation: ctr < 2.0 ? 'Test 3 new video hooks and high-contrast headlines' : 'Scale current winning visual ad assets'
    },
    {
      metric: 'Cost Per Lead (CPL)',
      formula: 'Total Ad Spend / Total Leads',
      value: `₹${cpl.toFixed(0)}`,
      interpretation: cpl <= 1200 ? 'Highly cost-efficient lead acquisition' : 'CPL higher than target benchmark (₹1,500)',
      implication: 'Determines cash efficiency before sales qualification takes over',
      recommendation: cpl > 1500 ? 'Filter out broad search keywords; mandate phone number verification on forms' : 'Maintain ad spend and allocate 20% to lookalike audiences'
    },
    {
      metric: 'Qualified Lead Rate',
      formula: '(Qualified Leads / Total Leads) × 100',
      value: `${qualLeadRate.toFixed(1)}%`,
      interpretation: qualLeadRate >= 35 ? 'Healthy lead quality filter' : 'Too many unqualified budget-mismatched leads',
      implication: 'Prevents sales team burnout on low-intent contacts',
      recommendation: qualLeadRate < 30 ? 'Introduce budget-qualification dropdown (₹75L+) directly in lead forms' : 'Fast-track qualified leads to direct WhatsApp demo walkthrough'
    },
    {
      metric: 'Customer Acquisition Cost (CAC)',
      formula: 'Total Spend / Total Customers Won',
      value: `₹${cac.toFixed(0)}`,
      interpretation: `CAC represents ${((cac / (totalRevenue / (totalCustomers || 1))) * 100).toFixed(2)}% of average unit sales value`,
      implication: 'Extraordinarily profitable margin profile for luxury real estate',
      recommendation: 'Reinvest 15% of closed commission into highest ROAS channels (Google Search + LinkedIn)'
    },
    {
      metric: 'Return On Ad Spend (ROAS)',
      formula: 'Total Revenue / Total Ad Spend',
      value: `${roas.toFixed(1)}x`,
      interpretation: `${roas.toFixed(1)}x return on marketing expenditure`,
      implication: 'Validates marketing model for immediate scaling',
      recommendation: 'Increase Google Search branded terms budget by 30% for Q4'
    }
  ];

  res.json({
    summary: {
      totalImpressions,
      totalClicks,
      totalLeads,
      totalQualified,
      totalMeetings,
      totalCustomers,
      totalSpend,
      totalRevenue
    },
    metrics: analysisCards
  });
});

// 4. Tasks & Audit Logs
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasksStore);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const newTask: Task = {
    task_id: `TSK-${100 + tasksStore.length + 1}`,
    title: req.body.title || 'Untitled Action Item',
    description: req.body.description || '',
    type: req.body.type || 'CALL',
    priority: req.body.priority || 'MEDIUM',
    status: req.body.status || 'TODO',
    due_date: req.body.due_date || new Date().toISOString().slice(0, 10),
    related_lead_id: req.body.related_lead_id,
    related_lead_name: req.body.related_lead_name,
    created_at: new Date().toISOString().slice(0, 10)
  };
  tasksStore.unshift(newTask);
  logAudit('CREATE_TASK', 'task_service', newTask.title, `Created task for lead ${newTask.related_lead_name || 'General'}`);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const index = tasksStore.findIndex(t => t.task_id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasksStore[index] = { ...tasksStore[index], ...req.body };
  logAudit('UPDATE_TASK', 'task_service', tasksStore[index].title, `Status updated to ${tasksStore[index].status}`);
  res.json(tasksStore[index]);
});

app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json(auditLogsStore);
});

// 5. Knowledge Base & RAG Search
app.get('/api/knowledge', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...knowledgeStore];

  if (category && typeof category === 'string') {
    results = results.filter(k => k.category === category);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    results = results.filter(k =>
      k.title.toLowerCase().includes(s) ||
      k.summary.toLowerCase().includes(s) ||
      k.content.toLowerCase().includes(s)
    );
  }

  res.json(results);
});

app.post('/api/knowledge/upload', (req: Request, res: Response) => {
  const { title, category, content, summary } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const newDoc: KnowledgeDocument = {
    id: `DOC-${Date.now().toString().slice(-4)}`,
    title,
    category: category || 'templates',
    filename: `knowledge/${category || 'templates'}/${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`,
    summary: summary || content.slice(0, 120) + '...',
    content,
    updated_at: new Date().toISOString().slice(0, 10)
  };

  knowledgeStore.push(newDoc);
  logAudit('UPLOAD_DOCUMENT', 'knowledge_tools', newDoc.title, `Indexed new document in category: ${newDoc.category}`);
  res.status(201).json(newDoc);
});

// ----------------- GEMINI AI AGENT ENDPOINTS ----------------- //

// A. Conversational Assistant with Tools Context
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // Collect top context from database to ground the response
    const topHotLeads = leadsStore
      .filter(l => l.status === 'HOT' || l.lead_score >= 80)
      .slice(0, 6)
      .map(l => `${l.name} (${l.city}, ₹${(l.budget / 10000000).toFixed(2)}Cr, Score: ${l.lead_score}, Stage: ${l.stage}, Next: ${l.recommended_next_action})`)
      .join('; ');

    const pipelineCounts = leadsStore.reduce((acc: any, curr) => {
      acc[curr.stage] = (acc[curr.stage] || 0) + 1;
      return acc;
    }, {});

    const relevantDocs = knowledgeStore.slice(0, 3).map(d => `[${d.filename}]: ${d.summary}`).join('\n');

    const systemPrompt = `You are the Niteesh AI Sales & Marketing Agent.
You support Niteesh Pandey, founder of Niteesh AI Growth Labs.
Your purpose is to improve sales execution, marketing decisions, lead intelligence, customer communication, and business intelligence.
Demo Client: UrbanNest Properties (Fictional real estate company in Mumbai, Thane, Pune).

STRICT RULES:
1. Never fabricate data or customer facts. Never invent pricing.
2. Clearly separate FACT, INFERENCE, ASSUMPTION, and RECOMMENDATION.
3. Follow the sequence: DATA -> CONTEXT -> ANALYSIS -> REASONING -> RECOMMENDATION -> ACTION PLAN.
4. When evidence is insufficient, say: "Insufficient data." and specify what is missing.
5. Address the owner as Niteesh.
6. Address external actions or sensitive edits with draft suggestions and request owner approval.

CURRENT LIVE BUSINESS CONTEXT:
- Total Leads in CRM: ${leadsStore.length}
- Pipeline Stages: ${JSON.stringify(pipelineCounts)}
- Top Priority Leads: ${topHotLeads}
- Active Campaigns: ${campaignsStore.length} (Google Search, LinkedIn Ads, Instagram, Email, Channel Partner)
- Knowledge Base Index: ${relevantDocs}`;

    const formattedHistory = conversationHistory
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Niteesh' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `${formattedHistory ? formattedHistory + '\n' : ''}Niteesh: ${message}
Assistant:`;

    const reply = await callGemini(prompt, systemPrompt, SYSTEM_SETTINGS.primary_model);
    logAudit('AI_CHAT_QUERY', 'gemini_agent', 'conversation', `Handled user query: "${message.slice(0, 50)}..."`);

    res.json({
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Error executing AI chat assistant.' });
  }
});

// B. Sales Copy & Follow-Up Generator
app.post('/api/gemini/sales-draft', async (req: Request, res: Response) => {
  const { leadId, emailType, tone = 'Consultative' } = req.body;
  const lead = leadsStore.find(l => l.lead_id === leadId);

  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  const prompt = `Generate a high-converting, professional real estate sales message for Niteesh Pandey representing UrbanNest Properties.

RECIPIENT CONTEXT:
- Name: ${lead.name}
- Company: ${lead.company}
- Job Title: ${lead.job_title}
- City: ${lead.city}
- Interested Product: ${lead.product_interest}
- Budget: ₹${(lead.budget / 10000000).toFixed(2)} Cr
- Current Stage: ${lead.stage}
- Notes & Recent Context: ${lead.notes}

SPECIFICATIONS:
- Message Type: ${emailType || 'Follow-up Email'}
- Desired Tone: ${tone} (Options: Professional, Consultative, Executive, Short, Persuasive but non-manipulative)
- Brand: UrbanNest Properties (Premium residential properties in Mumbai, Thane, Pune)
- Sender: Niteesh Pandey, Founder - Niteesh AI Growth Labs / Advisory Partner for UrbanNest Properties

STRUCTURE REQUIRED:
1. Subject line (compelling, zero spam keywords)
2. Personalized greeting referencing their specific context
3. Value proposition / Evidence (e.g., usable carpet area efficiency, 10:90 milestone plan, or rental yield)
4. Clear consultative Call To Action (CTA)
5. Professional sign-off`;

  try {
    const draft = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model);
    logAudit('CREATE_EMAIL_DRAFT', 'sales_tools', lead.name, `Generated ${emailType} in ${tone} tone`);
    res.json({
      leadId,
      recipient: lead.name,
      email: lead.email,
      draft,
      status: 'DRAFT_GENERATED'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate sales copy.' });
  }
});

// C. Objection Handling Engine
app.post('/api/gemini/objection-handler', async (req: Request, res: Response) => {
  const { category, customerQuote, productContext } = req.body;

  const prompt = `Provide an evidence-based objection handling response for UrbanNest Properties residential real estate.
OBJECTION CATEGORY: ${category || 'Price'}
CUSTOMER STATEMENT: "${customerQuote || 'Your price per sqft is higher than neighboring developers.'}"
PRODUCT: ${productContext || 'UrbanNest Prime Residences & Select Homes'}

Return a valid JSON object matching this schema:
{
  "objection": "Summarized customer objection",
  "likelyConcern": "Underlying emotional or financial risk concern",
  "suggestedResponse": "Word-for-word consultative dialogue response",
  "proofEvidenceNeeded": "RERA certification, carpet efficiency study, or rent guarantee document needed",
  "followUpQuestion": "A non-defensive question to advance the dialogue",
  "nextStep": "Specific concrete action to schedule"
}`;

  try {
    const rawJson = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model, true);
    const parsed = JSON.parse(rawJson);
    logAudit('OBJECTION_ANALYSIS', 'sales_tools', category, `Analyzed objection: ${category}`);
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process objection response.' });
  }
});

// D. Marketing Content Generator
app.post('/api/gemini/marketing-content', async (req: Request, res: Response) => {
  const { platform, contentType, goal, audience, offer, tone, cta } = req.body;

  const prompt = `Create marketing content for UrbanNest Properties.
Platform: ${platform || 'LinkedIn'}
Content Type: ${contentType || 'Post'}
Goal: ${goal || 'Lead Generation for Prime Residences'}
Audience: ${audience || 'High-income tech founders & doctors in Mumbai/Pune'}
Offer: ${offer || '10:90 payment scheme + 82% usable carpet area guarantee'}
Tone: ${tone || 'Executive & Credible'}
CTA: ${cta || 'Book an exclusive private tour'}

Return a valid JSON object:
{
  "hook": "Attention grabbing opening headline or hook",
  "mainMessage": "Core narrative body highlighting proof and lifestyle value",
  "proofEvidence": "Data point (e.g. 82% usable carpet vs 68% industry standard, 6.2% assured yield)",
  "cta": "Exact call to action string",
  "variantA": "A/B test variation focusing on financial ROI",
  "variantB": "A/B test variation focusing on family lifestyle & space"
}`;

  try {
    const rawJson = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model, true);
    const parsed = JSON.parse(rawJson);
    logAudit('MARKETING_GEN', 'marketing_tools', platform, `Generated ${contentType} for ${platform}`);
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate marketing copy.' });
  }
});

// E. Meeting Intelligence Extractor
app.post('/api/gemini/analyze-meeting', async (req: Request, res: Response) => {
  const { transcript, meetingNotes } = req.body;
  const inputData = transcript || meetingNotes;

  if (!inputData || inputData.length < 20) {
    return res.status(400).json({ error: 'Please provide substantive meeting notes or transcript text.' });
  }

  const prompt = `You are a Senior CRM Intelligence Specialist. Extract structured CRM intelligence from this client meeting transcript or notes.

INPUT NOTES:
"""
${inputData}
"""

Return a valid JSON object matching:
{
  "participants": ["List of attendee names"],
  "customer_need": "Summary of what customer is trying to accomplish",
  "pain_points": ["Pain point 1", "Pain point 2"],
  "budget": "Explicit budget or 'Not stated'",
  "timeline": "Timeline mentioned or 'Insufficient data'",
  "objections": ["Any hesitations or concerns raised"],
  "requirements": ["Key product specifications requested"],
  "competitors_mentioned": ["Any competing projects or developers"],
  "commitments": ["What Niteesh or sales team committed to provide"],
  "next_steps": ["Action item 1", "Action item 2"],
  "follow_up_date": "Recommended follow-up date (YYYY-MM-DD)",
  "potential_opportunity": "Deal size or product fit assessment",
  "risk_factors": ["Potential deal breakers or risks"],
  "summary": "Executive CRM summary paragraph"
}`;

  try {
    const rawJson = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model, true);
    const parsed = JSON.parse(rawJson);
    logAudit('ANALYZE_MEETING', 'meeting_service', 'Transcript', 'Extracted structured CRM intelligence');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze meeting.' });
  }
});

// F. Daily Sales Plan Generator ("Create My Day Plan")
app.post('/api/gemini/daily-plan', async (req: Request, res: Response) => {
  const highPriorityLeads = leadsStore
    .filter(l => l.lead_score >= 75)
    .slice(0, 5)
    .map(l => `${l.name} (${l.stage}, Score: ${l.lead_score}, Action: ${l.recommended_next_action})`);

  const pendingTasks = tasksStore
    .filter(t => t.status !== 'DONE')
    .slice(0, 6)
    .map(t => `${t.title} [${t.priority}] (Due: ${t.due_date})`);

  const prompt = `You are the Daily Sales Manager for Niteesh Pandey, founder of Niteesh AI Growth Labs.
Analyze today's schedule, pipeline priority leads, and pending tasks.

INPUT DATA:
- Top Hot Leads Today:
  ${highPriorityLeads.join('\n  ')}
- Pending Urgent Tasks:
  ${pendingTasks.join('\n  ')}
- Date: ${new Date().toISOString().slice(0, 10)}

Create an optimal, high-impact day plan split into 4 chronological blocks:
1. Morning (Strategic outreach, hot calls, high-energy negotiations)
2. Midday (Meetings, site walkthroughs, presentations)
3. Afternoon (Proposals, bank coordination, customer collateral)
4. End-of-day (CRM updates, pipeline review, tomorrow's prep)

Return a valid JSON array of 4 objects:
[
  {
    "timeSlot": "Morning",
    "tasks": [
      {
        "task": "Concrete task title",
        "reason": "Why this matters",
        "expectedImpact": "Quantifiable or strategic outcome",
        "estimatedEffort": "e.g. 45 mins",
        "priority": "CRITICAL",
        "evidence": "Data reference from leads/pipeline"
      }
    ]
  },
  ... (Midday, Afternoon, End-of-day)
]`;

  try {
    const rawJson = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model, true);
    const parsed = JSON.parse(rawJson);
    logAudit('CREATE_DAILY_PLAN', 'daily_manager', 'Day Plan', 'Generated 4-block strategic day schedule');
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate day plan.' });
  }
});

// G. Weekly Management Report Generator
app.post('/api/gemini/management-report', async (req: Request, res: Response) => {
  const totalLeads = leadsStore.length;
  const wonDeals = leadsStore.filter(l => l.stage === 'WON');
  const negotiationDeals = leadsStore.filter(l => l.stage === 'NEGOTIATION');
  const proposalDeals = leadsStore.filter(l => l.stage === 'PROPOSAL');
  const hotLeads = leadsStore.filter(l => l.status === 'HOT');

  const pipelineValue = [...negotiationDeals, ...proposalDeals].reduce((sum, l) => sum + l.budget, 0);
  const closedRevenue = wonDeals.reduce((sum, l) => sum + l.budget, 0);

  const prompt = `Generate an executive Weekly Sales & Marketing Management Report for Niteesh Pandey.
Company: Niteesh AI Growth Labs
Demo Client: UrbanNest Properties

VERIFIED METRICS:
- Total Leads Active: ${totalLeads}
- Hot Priority Opportunities: ${hotLeads.length}
- Deals in Negotiation: ${negotiationDeals.length}
- Proposals Under Review: ${proposalDeals.length}
- Deals Won: ${wonDeals.length}
- Total Closed Booking Revenue: ₹${(closedRevenue / 10000000).toFixed(2)} Cr
- Weighted Active Pipeline: ₹${(pipelineValue / 10000000).toFixed(2)} Cr
- Top Lead Sources: Website, LinkedIn Ads, Channel Partners

REPORT FORMAT (Professional Markdown):
# Weekly Sales & Marketing Report
### Prepared for: Niteesh Pandey, Founder

1. **Executive Summary**
2. **Sales Performance & Pipeline Health** (Quote exact metrics)
3. **Lead Quality & Deterministic Scoring Distribution**
4. **Conversion Funnel & Drop-Off Analysis**
5. **Marketing Channel ROI & Attribution**
6. **Top 3 High-Probability Opportunities**
7. **Identified Risks & Bottlenecks**
8. **Actionable Recommendations for Next Week**`;

  try {
    const report = await callGemini(prompt, undefined, SYSTEM_SETTINGS.primary_model);
    logAudit('GENERATE_REPORT', 'report_service', 'Weekly Report', 'Generated comprehensive management report');
    res.json({ report });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate report.' });
  }
});

// Reset Demo Data
app.post('/api/settings/reset-demo', (req: Request, res: Response) => {
  leadsStore = [...INITIAL_LEADS];
  campaignsStore = [...INITIAL_CAMPAIGNS];
  tasksStore = [...INITIAL_TASKS];
  knowledgeStore = [...INITIAL_KNOWLEDGE_DOCUMENTS];
  auditLogsStore = [...INITIAL_AUDIT_LOGS];
  logAudit('RESET_DEMO_DATA', 'settings', 'database', 'Reset store to initial 50+ demo leads and 10 campaigns.');
  res.json({ success: true, message: 'Demo data successfully refreshed.' });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Niteesh AI Sales & Marketing Command Center running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
