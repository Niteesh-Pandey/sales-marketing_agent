# Niteesh AI Sales & Marketing Command Center

[![GitHub Repository](https://img.shields.io/badge/GitHub-Niteesh--Pandey%2Fsales--marketing__agent-indigo?logo=github)](https://github.com/Niteesh-Pandey/sales-marketing_agent)
[![Author](https://img.shields.io/badge/Author-Niteesh%20Pandey-blue)](mailto:niteeshpandey9555@gmail.com)
[![Organization](https://img.shields.io/badge/Organization-Niteesh%20AI%20Growth%20Labs-purple)](https://github.com/Niteesh-Pandey)
[![Runtime](https://img.shields.io/badge/Node.js-22%20LTS-green?logo=node.js)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/React-19%20%2B%20Vite-cyan?logo=react)](https://react.dev/)
[![AI Engine](https://img.shields.io/badge/Gemini-3.8%20%7C%203.1%20%7C%202.5-amber?logo=google)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20Dual--Engine-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald)](LICENSE)

An enterprise-grade, evidence-grounded AI Sales & Marketing Command Center engineered by **Niteesh Pandey** for **Niteesh AI Growth Labs** (demonstrating client **UrbanNest Properties**, luxury real estate in Mumbai, Thane, and Pune).

Built to unify real-time CRM intelligence, transparent deterministic lead scoring, consultative objection handling, multi-channel marketing attribution, RAG document search, meeting intelligence extraction, and executive management reporting.

---

## Architecture Sequence

The system strictly executes the deterministic business sequence:
$$\text{DATA} \longrightarrow \text{CONTEXT} \longrightarrow \text{ANALYSIS} \longrightarrow \text{REASONING} \longrightarrow \text{RECOMMENDATION} \longrightarrow \text{ACTION PLAN}$$

It rigorously enforces epistemic separation across all operations:
- **FACT:** Directly verified data points from the CRM database or knowledge base.
- **INFERENCE:** Mathematical calculations and logical deductions derived from verifiable facts.
- **ASSUMPTION:** Hypotheses clearly flagged for sales executive or client confirmation.
- **RECOMMENDATION:** High-impact, evidence-grounded consultative action plans.

---

## Core Capabilities & Workspaces

1. **AI Sales & Marketing Copilot:** Multi-turn conversational intelligence grounded in 50+ live CRM leads, 10 active campaigns, and indexed RAG documents.
2. **Deterministic Lead Scoring Engine:** 8-dimension transparent scoring model (0–100) evaluating Budget Fit, Product Fit, Purchase Intent, Engagement Recency, Decision Authority, Timeline, and Geographic Location.
3. **Interactive Visual Pipeline (Kanban):** 8-stage visual pipeline with real-time deal stage tracking and weighted revenue aggregation.
4. **Consultative Sales & Objection Engine:** Evidence-grounded follow-up drafting with tone selection, plus resolution frameworks across 11 standard customer objection categories.
5. **Marketing Content & A/B Engine:** Multi-platform creative generation (LinkedIn, Instagram, Email, WhatsApp) with dual A/B creative testing variants.
6. **Marketing Funnel & ROAS Analytics:** Mathematical computation of 11 core growth KPIs (CTR, CPC, CPL, Qualified Lead Rate, CAC, ROAS, ROI) with automated bottleneck diagnosis.
7. **Meeting Intelligence Specialist:** Real estate sales call transcript / meeting notes extractor compiling structured CRM-ready records and follow-ups.
8. **Daily Command Center & Day Plan:** 4-block chronological day schedule (Morning, Midday, Afternoon, EOD) prioritizing high-impact revenue opportunities.
9. **RAG Knowledge Base:** 9-category document repository with mandatory source-citation behavior.
10. **Executive Reports & Audit Trail:** One-click executive weekly briefing generator with verified pipeline numbers and immutable compliance audit logging.

---

## Multi-Model Gemini Engine

The application integrates the official `@google/genai` TypeScript SDK and allows hot-swapping between models:
- **Gemini 3.8 Flash (`gemini-3.8-flash`):** Primary production model — ultra-fast multimodal reasoning and instant CRM synthesis.
- **Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`):** Extreme throughput & sub-second latency for high-frequency lead operations.
- **Gemini 2.5 Flash (`gemini-2.5-flash`):** Balanced workhorse for daily copywriting and content formatting.
- **Gemini 2.5 Pro (`gemini-2.5-pro`):** Maximum cognitive depth for complex multi-touch attribution and strategic scenario modeling.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js 20+ or 22 LTS
- npm 10+
- Google Gemini API Key ([Get one free at Google AI Studio](https://aistudio.google.com/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/Niteesh-Pandey/sales-marketing_agent.git
cd sales-marketing_agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite

# Optional PostgreSQL Connection (falls back automatically to in-memory store if offline)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/niteesh_growth_labs
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## Docker & Container Deployment

Deploy anywhere with the included production Dockerfile:

### Run with Docker Compose (App + PostgreSQL)
```bash
docker compose up -d --build
```

### Run standalone Docker Container
```bash
docker build -t niteesh-sales-agent .
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" niteesh-sales-agent
```

---

## Cloud Hosting (Render, Railway, Fly.io, VPS)

### One-Click Render / Railway Deploy
1. Link your GitHub repository (`Niteesh-Pandey/sales-marketing_agent`).
2. Set Environment: **Node** (v22).
3. Build Command: `npm run build`
4. Start Command: `npm run start`
5. Add Environment Variable: `GEMINI_API_KEY`

---

## GitHub Push & Release Instructions

To sync updates directly to your GitHub repository:
```bash
# 1. Initialize git & configure user
git init
git config user.name "Niteesh Pandey"
git config user.email "niteeshpandey9555@gmail.com"

# 2. Stage changes
git add .

# 3. Commit
git commit -m "feat: Niteesh AI Sales & Marketing Command Center enterprise v1.0"

# 4. Link remote and push
git remote add origin https://github.com/Niteesh-Pandey/sales-marketing_agent.git
git branch -M main
git push -u origin main
```

---

## Safety, Compliance & Governance

- **Zero API Key Leaks:** API keys never touch the browser; all Gemini calls occur via protected server-side endpoints (`/api/gemini/*`).
- **Approval Workflow:** All outbound emails and marketing copies remain in DRAFT status until confirmed by human leadership.
- **Strict Citation Mandate:** When evidence is missing from documents or CRM records, the agent outputs *"Insufficient data"* rather than hallucinating figures.

---

## Author & Contact

**Niteesh Pandey**  
Founder & Lead Architect — *Niteesh AI Growth Labs*  
- GitHub: [@Niteesh-Pandey](https://github.com/Niteesh-Pandey)  
- Email: [niteeshpandey9555@gmail.com](mailto:niteeshpandey9555@gmail.com)  
- Repository: [https://github.com/Niteesh-Pandey/sales-marketing_agent](https://github.com/Niteesh-Pandey/sales-marketing_agent)
